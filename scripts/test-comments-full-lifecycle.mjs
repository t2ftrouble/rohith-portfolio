import http from 'http';

function makeRequest(options, postData = null) {
  return new Promise((resolve) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(data); } catch {}
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data,
          json
        });
      });
    });

    req.on('error', (err) => {
      resolve({ status: 500, error: err.message });
    });

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function runCommentTests() {
  console.log("==================================================================");
  console.log("COMMENT CMS END-TO-END PRODUCTION TEST SUITE");
  console.log("==================================================================");

  let passCount = 0;
  let failCount = 0;

  // 1. Test Admin Login
  console.log("\n[TEST 1] Admin Authentication & Session Token Generation:");
  const loginRes = await makeRequest({
    hostname: 'localhost',
    port: 8080,
    path: '/api/admin/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, JSON.stringify({ password: 'rohith2024' }));

  let cookie = '';
  if (loginRes.status === 200 && loginRes.headers && loginRes.headers['set-cookie']) {
    cookie = loginRes.headers['set-cookie'][0].split(';')[0];
    console.log(`  ✓ PASS: Login successful, received session cookie.`);
    passCount++;
  } else {
    console.error(`  ✗ FAIL: Login failed (Status ${loginRes.status})`);
    failCount++;
  }

  // 2. Test Unauthorized Admin Access to /api/comments?all=true
  console.log("\n[TEST 2] Security: Unauthorized GET /api/comments?all=true returns 401:");
  const unauthRes = await makeRequest({
    hostname: 'localhost',
    port: 8080,
    path: '/api/comments?all=true',
    method: 'GET'
  });
  if (unauthRes.status === 401) {
    console.log(`  ✓ PASS: HTTP 401 returned as expected without admin session.`);
    passCount++;
  } else {
    console.error(`  ✗ FAIL: Expected 401, got ${unauthRes.status}`);
    failCount++;
  }

  // 3. Test Authorized Admin Access to /api/comments?all=true
  console.log("\n[TEST 3] Authorized Admin GET /api/comments?all=true returns all comments with casing:");
  const authCommentsRes = await makeRequest({
    hostname: 'localhost',
    port: 8080,
    path: '/api/comments?all=true',
    method: 'GET',
    headers: { 'Cookie': cookie }
  });
  if (authCommentsRes.status === 200 && Array.isArray(authCommentsRes.json?.comments)) {
    console.log(`  ✓ PASS: HTTP 200, returned ${authCommentsRes.json.comments.length} comments.`);
    authCommentsRes.json.comments.forEach((c) => {
      console.log(`    - ID: ${c.id} | Film: ${c.projectSlug} | User: ${c.userName} | Status: ${c.status} | Date: ${c.createdAt}`);
    });
    passCount++;
  } else {
    console.error(`  ✗ FAIL: Status ${authCommentsRes.status}, error:`, authCommentsRes.json);
    failCount++;
  }

  // 4. Test Public GET /api/comments?projectSlug=one-last-day
  console.log("\n[TEST 4] Public GET /api/comments?projectSlug=one-last-day (Only APPROVED):");
  const publicInitialRes = await makeRequest({
    hostname: 'localhost',
    port: 8080,
    path: '/api/comments?projectSlug=one-last-day',
    method: 'GET'
  });
  if (publicInitialRes.status === 200) {
    console.log(`  ✓ PASS: HTTP 200, currently ${publicInitialRes.json?.comments?.length || 0} approved comments visible publicly.`);
    passCount++;
  } else {
    console.error(`  ✗ FAIL: Status ${publicInitialRes.status}`);
    failCount++;
  }

  // 5. Test POST New Visitor Comment (Should be created with status PENDING)
  console.log("\n[TEST 5] Visitor POST /api/comments -> Created as PENDING:");
  const testUserId = `usr_test_${Date.now()}`;
  const postCommentRes = await makeRequest({
    hostname: 'localhost',
    port: 8080,
    path: '/api/comments',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, JSON.stringify({
    projectSlug: 'one-last-day',
    userId: testUserId,
    userName: 'QA Automated Tester',
    userEmail: 'qa-tester@example.com',
    userAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=QA',
    content: 'CMS COMMENT LIFECYCLE QA TEST'
  }));

  const createdComment = postCommentRes.json?.comment;
  if ((postCommentRes.status === 200 || postCommentRes.status === 201) && createdComment && createdComment.status === 'PENDING') {
    console.log(`  ✓ PASS: Status ${postCommentRes.status}, Created comment ID: ${createdComment.id} with status: ${createdComment.status}`);
    passCount++;
  } else {
    console.error(`  ✗ FAIL: Status ${postCommentRes.status}, response:`, postCommentRes.json);
    failCount++;
  }

  const commentId = createdComment?.id;

  if (commentId) {
    // 6. Verify New Comment is HIDDEN from Public View while PENDING
    console.log("\n[TEST 6] Verify PENDING comment is NOT visible on public /api/comments:");
    const publicPendingCheck = await makeRequest({
      hostname: 'localhost',
      port: 8080,
      path: '/api/comments?projectSlug=one-last-day',
      method: 'GET'
    });
    const isVisibleWhilePending = publicPendingCheck.json?.comments?.some((c) => c.id === commentId);
    if (!isVisibleWhilePending) {
      console.log(`  ✓ PASS: Comment ${commentId} is correctly HIDDEN from public page while PENDING.`);
      passCount++;
    } else {
      console.error(`  ✗ FAIL: PENDING comment was leaked to public page!`);
      failCount++;
    }

    // 7. Test Admin APPROVE Action
    console.log("\n[TEST 7] Admin PUT /api/comments -> Set status to APPROVED:");
    const approveRes = await makeRequest({
      hostname: 'localhost',
      port: 8080,
      path: '/api/comments',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookie
      }
    }, JSON.stringify({
      id: commentId,
      status: 'APPROVED'
    }));
    if (approveRes.status === 200 && approveRes.json?.comment?.status === 'APPROVED') {
      console.log(`  ✓ PASS: Status ${approveRes.status}, comment status successfully updated to APPROVED in database.`);
      passCount++;
    } else {
      console.error(`  ✗ FAIL: Failed to approve comment:`, approveRes.json);
      failCount++;
    }

    // 8. Verify Approved Comment is NOW VISIBLE on Public Website
    console.log("\n[TEST 8] Verify APPROVED comment is NOW visible on public project page:");
    const publicApprovedCheck = await makeRequest({
      hostname: 'localhost',
      port: 8080,
      path: '/api/comments?projectSlug=one-last-day',
      method: 'GET'
    });
    const isVisibleAfterApproval = publicApprovedCheck.json?.comments?.some((c) => c.id === commentId);
    if (isVisibleAfterApproval) {
      console.log(`  ✓ PASS: Comment ${commentId} is NOW LIVE and visible on public project page.`);
      passCount++;
    } else {
      console.error(`  ✗ FAIL: APPROVED comment is not appearing on public page!`);
      failCount++;
    }

    // 9. Test Admin REJECT Action
    console.log("\n[TEST 9] Admin PUT /api/comments -> Set status to REJECTED:");
    const rejectRes = await makeRequest({
      hostname: 'localhost',
      port: 8080,
      path: '/api/comments',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookie
      }
    }, JSON.stringify({
      id: commentId,
      status: 'REJECTED'
    }));
    if (rejectRes.status === 200 && rejectRes.json?.comment?.status === 'REJECTED') {
      console.log(`  ✓ PASS: Comment status updated to REJECTED.`);
      passCount++;
    } else {
      console.error(`  ✗ FAIL: Failed to reject comment:`, rejectRes.json);
      failCount++;
    }

    // 10. Test Admin ARCHIVE / HIDE Action
    console.log("\n[TEST 10] Admin PUT /api/comments -> Set status to HIDDEN (ARCHIVED):");
    const archiveRes = await makeRequest({
      hostname: 'localhost',
      port: 8080,
      path: '/api/comments',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookie
      }
    }, JSON.stringify({
      id: commentId,
      status: 'HIDDEN'
    }));
    if (archiveRes.status === 200 && archiveRes.json?.comment?.status === 'HIDDEN') {
      console.log(`  ✓ PASS: Comment status updated to HIDDEN (ARCHIVED).`);
      passCount++;
    } else {
      console.error(`  ✗ FAIL: Failed to archive comment:`, archiveRes.json);
      failCount++;
    }

    // 11. Test Admin DELETE Action
    console.log("\n[TEST 11] Admin DELETE /api/comments -> Permanently remove test comment:");
    const deleteRes = await makeRequest({
      hostname: 'localhost',
      port: 8080,
      path: `/api/comments?id=${encodeURIComponent(commentId)}`,
      method: 'DELETE',
      headers: { 'Cookie': cookie }
    });
    if (deleteRes.status === 200 && deleteRes.json?.success) {
      console.log(`  ✓ PASS: Comment ${commentId} permanently deleted from database.`);
      passCount++;
    } else {
      console.error(`  ✗ FAIL: Failed to delete comment:`, deleteRes.json);
      failCount++;
    }

    // 12. Verify Deletion in Admin Queue & Public Page
    console.log("\n[TEST 12] Verify comment is completely gone from all queries:");
    const finalQueueCheck = await makeRequest({
      hostname: 'localhost',
      port: 8080,
      path: '/api/comments?all=true',
      method: 'GET',
      headers: { 'Cookie': cookie }
    });
    const stillInDb = finalQueueCheck.json?.comments?.some((c) => c.id === commentId);
    if (!stillInDb) {
      console.log(`  ✓ PASS: Verified comment ${commentId} is completely removed from database.`);
      passCount++;
    } else {
      console.error(`  ✗ FAIL: Deleted comment still found in database!`);
      failCount++;
    }
  }

  console.log("\n==================================================================");
  console.log(`SUMMARY: ${passCount} PASSED, ${failCount} FAILED`);
  console.log("==================================================================");
}

runCommentTests().catch(console.error);
