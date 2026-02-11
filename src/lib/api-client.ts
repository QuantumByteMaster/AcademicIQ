// All calls now go through Next.js API routes (which verify session + add internal secret)
export const apiClient = {
  async getCuratedResources() {
    const response = await fetch('/api/curate-resources');
    if (!response.ok) {
      throw new Error('Failed to fetch resources');
    }
    return response.json();
  },

  async createCuratedResources(userId: string, subject: string) {
    const response = await fetch('/api/curate-resources', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (data.error === 'RESOURCE_EXISTS') {
        return data;
      }
      throw {
        status: response.status,
        error: data.error,
        message: data.message,
        response: { data },
      };
    }

    return data;
  },

  async getStudyPlan() {
    const response = await fetch('/api/study-plan');
    if (!response.ok) {
      throw new Error('Failed to fetch study plan');
    }
    return response.json();
  },

  async createStudyPlan(userId: string, subject: string, examDate: string) {
    const response = await fetch('/api/study-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, examDate }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (data.error === 'PLAN_EXISTS') {
        return data;
      }
      throw {
        status: response.status,
        error: data.error,
        message: data.message,
        response: { data },
      };
    }

    return data;
  },

  async deleteStudyPlan(planId: string) {
    const response = await fetch(`/api/study-plan?planId=${planId}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (!response.ok) {
      throw {
        status: response.status,
        error: data.error,
        message: data.message || 'Failed to delete plan',
        response: { data },
      };
    }

    return data;
  },

  async deleteCuratedResources(resourceId: string) {
    const response = await fetch(
      `/api/curate-resources?resourceId=${resourceId}`,
      { method: 'DELETE' }
    );
    if (!response.ok) {
      throw new Error('Failed to delete resources');
    }
    return response.json();
  },
};
