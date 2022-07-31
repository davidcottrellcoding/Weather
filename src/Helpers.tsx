import { Hour } from "./ThreeDayApiResponse";

export function dayToName(day: number) {
  switch (day) {
    case 0:
      return "Sunday";
    case 1:
      return "Monday";
    case 2:
      return "Tuesday";
    case 3:
      return "Wednesday";
    case 4:
      return "Thursday";
    case 5:
      return "Friday";
    case 6:
      return "Saturday";
    default:
      return "This shouldnt appear";
  }
}

export interface GraphData {
  time: string;
  temperature: number;
}

export const generateGraphData = (hour: Hour[]): GraphData[] => {
  const data: GraphData[] = [];

  hour.forEach((hour) => {
    const timeOfDay = hour.time.trim().split(/\s+/)[1];

    const extractedData: GraphData = {
      time: timeOfDay,
      temperature: hour.temp_f,
    };

    data.push(extractedData);
  });
  return data;
};
