import { API_BASE_URL, API_KEY } from "./config";
import { ApiRequestsResponse, ApiServiceRequest } from "@/types/requestTypes";

const defaultHeaders: Record<string, string> = {
  "Content-Type": "application/json",
  "x-api-key": API_KEY || "",
};

// Define types for workshop statistics
interface WorkshopRequestStats {
  total_requests: number;
  pending_requests: number;
  in_progress_requests: number;
  completed_requests: number;
  cancelled_requests: number;
  average_completion_time: number;
  total_revenue: number;
  average_rating: number;
  period_start: string;
  period_end: string;
}

// Define type for review response
interface ReviewResponse {
  id: string;
  request_id: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
}

export const getAllRequests = async (
  token: string,
  params?: {
    limit?: number;
    offset?: number;
    status?: string;
    priority?: string;
    from?: string;
    to?: string;
    service_type_id?: string;
    workshop_id?: string;
    user_id?: string;
    vehicle_id?: string;
    search?: string;
  }
): Promise<ApiRequestsResponse> => {
  try {
    const queryParams = new URLSearchParams();

    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.offset) queryParams.append("offset", params.offset.toString());
    if (params?.status) queryParams.append("status", params.status);
    if (params?.priority) queryParams.append("priority", params.priority);
    if (params?.from) queryParams.append("from", params.from);
    if (params?.to) queryParams.append("to", params.to);
    if (params?.service_type_id)
      queryParams.append("service_type_id", params.service_type_id);
    if (params?.workshop_id)
      queryParams.append("workshop_id", params.workshop_id);
    if (params?.user_id) queryParams.append("user_id", params.user_id);
    if (params?.vehicle_id) queryParams.append("vehicle_id", params.vehicle_id);
    if (params?.search) queryParams.append("search", params.search);

    const url = `${API_BASE_URL}/services/requests${
      queryParams.toString() ? `?${queryParams}` : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        ...defaultHeaders,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get requests: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting requests:", error);
    throw error;
  }
};

// Get user's own requests
export const getMyRequests = async (
  token: string
): Promise<ApiRequestsResponse> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/services/requests/my-requests`,
      {
        method: "GET",
        headers: {
          ...defaultHeaders,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get my requests: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting my requests:", error);
    throw error;
  }
};

// Get request by ID
export const getRequestById = async (
  id: string,
  token: string
): Promise<ApiServiceRequest> => {
  try {
    const response = await fetch(`${API_BASE_URL}/services/requests/${id}`, {
      method: "GET",
      headers: {
        ...defaultHeaders,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get request: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting request by ID:", error);
    throw error;
  }
};

// Update request
export const updateRequest = async (
  id: string,
  updateData: Partial<{
    status: string;
    priority: string;
    notes: string;
    price: string;
    scheduled_at: string;
    workshop_id: string;
  }>,
  token: string
): Promise<ApiServiceRequest> => {
  try {
    console.log(
      `Making PATCH request to: ${API_BASE_URL}/services/requests/${id}`
    );
    console.log("Update data:", updateData);

    const response = await fetch(`${API_BASE_URL}/services/requests/${id}`, {
      method: "PATCH",
      headers: {
        ...defaultHeaders,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    });

    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response body:", errorText);

      let errorMessage = `Failed to update request: ${response.status} ${response.statusText}`;
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (parseError) {
        console.error("Could not parse error response:", parseError);
      }

      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log("Success response:", result);
    return result;
  } catch (error) {
    console.error("Error updating request:", error);
    throw error;
  }
};

// Update request status
export const updateRequestStatus = async (
  id: string,
  status: string,
  token: string
): Promise<ApiServiceRequest> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/services/requests/${id}/status`,
      {
        method: "PATCH",
        headers: {
          ...defaultHeaders,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to update request status: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating request status:", error);
    throw error;
  }
};

// Get workshop requests
export const getWorkshopRequests = async (
  workshopId: string,
  token: string
): Promise<ApiRequestsResponse> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/services/requests/workshop/${workshopId}`,
      {
        method: "GET",
        headers: {
          ...defaultHeaders,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to get workshop requests: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting workshop requests:", error);
    throw error;
  }
};

// Get workshop request statistics
export const getWorkshopRequestStats = async (
  workshopId: string,
  token: string
): Promise<WorkshopRequestStats> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/services/requests/workshop/${workshopId}/statistics`,
      {
        method: "GET",
        headers: {
          ...defaultHeaders,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get workshop stats: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting workshop stats:", error);
    throw error;
  }
};

// Create request (POST /services/requests)
export const createRequest = async (
  requestData: {
    user_id: string;
    vehicle_id: string;
    workshop_id: string;
    service_type_id: string;
    priority?: string;
    notes?: string;
    scheduled_at?: string;
  },
  token: string
): Promise<ApiServiceRequest> => {
  try {
    const response = await fetch(`${API_BASE_URL}/services/requests`, {
      method: "POST",
      headers: {
        ...defaultHeaders,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create request: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating request:", error);
    throw error;
  }
};

// Add review to completed request
export const addRequestReview = async (
  id: string,
  reviewData: {
    rating: number;
    comment: string;
  },
  token: string
): Promise<ReviewResponse> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/services/requests/${id}/review`,
      {
        method: "POST",
        headers: {
          ...defaultHeaders,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reviewData),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to add review: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding review:", error);
    throw error;
  }
};
