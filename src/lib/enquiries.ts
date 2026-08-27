// Enquiries Data Layer & Types

export type EnquiryStatus = "NEW" | "CONTACTED" | "COMPLETED" | "ARCHIVED";

export interface ContactEnquiry {
  id: string;
  name: string;
  email?: string;
  business?: string;
  location?: string;
  projectType: string;
  budget?: string;
  message: string;
  status: EnquiryStatus;
  createdAt: string;
  updatedAt?: string;
}

export async function getEnquiries(): Promise<ContactEnquiry[]> {
  try {
    const response = await fetch("/api/enquiries", {
      credentials: "include",
    });
    if (response.ok) {
      const data = await response.json();
      return Array.isArray(data.enquiries) ? data.enquiries : [];
    }
  } catch (error) {
    console.error("Failed to fetch enquiries:", error);
  }
  return [];
}

export async function submitEnquiry(
  enquiry: Omit<ContactEnquiry, "id" | "status" | "createdAt" | "updatedAt">
): Promise<{ success: boolean; id?: string }> {
  const response = await fetch("/api/enquiries", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ enquiry }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "Failed to submit enquiry");
  }

  return response.json();
}

export async function updateEnquiryStatus(
  id: string,
  status: EnquiryStatus
): Promise<ContactEnquiry> {
  const response = await fetch(`/api/enquiries`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ id, status }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "Failed to update enquiry status");
  }

  const result = await response.json();
  return result.enquiry;
}

export async function deleteEnquiry(id: string): Promise<boolean> {
  const response = await fetch(`/api/enquiries?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "Failed to delete enquiry");
  }

  const result = await response.json();
  return result.success;
}
