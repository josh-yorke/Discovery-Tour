import api from "../axios/axios";

export interface Award {
  companyId: string;
  companyName: string;
  year: number;
  monthNumber: number;
  monthName: string;
  date: string;
  images: string[];
  description: string;
  _id: string;
}

export interface AwardsByYear {
  year: number;
  awards: Award[];
}

export interface AwardsResponse {
  awards: Award[];
  awardsByYear: AwardsByYear[];
  years: number[]; // Array of unique years for pagination
}

export const getAwards = async (
  companyId?: string
): Promise<AwardsResponse> => {
  try {
    // If no companyId is provided, try to get it first
    if (!companyId) {
      // You could optionally fetch the company ID here if needed
      throw new Error("Company ID is required");
    }

    const res = await api.get(
      `/company/awards?id=${companyId}&groupByYear=true`
    );

    const groupedData = res.data.data;
    const awardsByYear: AwardsByYear[] = [];
    const allAwards: Award[] = [];
    const yearSet = new Set<number>();

    // Transform the grouped data
    Object.keys(groupedData).forEach((year) => {
      const yearNum = parseInt(year);
      const yearData = groupedData[year];
      const yearAwards: Award[] = [];

      Object.keys(yearData).forEach((month) => {
        const monthAwards = yearData[month];
        monthAwards.forEach((award: Award) => {
          allAwards.push(award);
          yearAwards.push(award);
          yearSet.add(yearNum);
        });
      });

      // Sort awards by date (most recent first)
      yearAwards.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      awardsByYear.push({
        year: yearNum,
        awards: yearAwards,
      });
    });

    // Sort years in descending order (most recent first)
    const years = Array.from(yearSet).sort((a, b) => b - a);

    return {
      awards: allAwards,
      awardsByYear,
      years,
    };
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || error;
    throw new Error(message);
  }
};
