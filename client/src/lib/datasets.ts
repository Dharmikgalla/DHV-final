import { DatasetConfig, MedicalPatient, CrimeSite, Customer, DataPoint } from "@shared/schema";

// Medical Dataset Configuration
export const medicalConfig: DatasetConfig = {
  id: 'medical',
  name: 'Medical Patients',
  icon: 'user',
  xAxis: { label: 'Blood Pressure (Systolic)', key: 'Blood_Pressure_Sys' },
  yAxis: { label: 'Temperature (°F)', key: 'Temperature_F' },
  tooltipFields: [
    { label: 'Age', key: 'Age', format: (v) => `${v} years` },
    { label: 'Temperature', key: 'Temperature_F', format: (v) => `${v}°F` },
    { label: 'BP (Sys/Dia)', key: 'Blood_Pressure_Sys', format: (v, data: any) => `${v}/${data.Blood_Pressure_Dia}` },
    { label: 'Sugar Level', key: 'Sugar_Level_mg_dL', format: (v) => `${v} mg/dL` },
  ],
  clusterColors: ['hsl(350, 75%, 60%)', 'hsl(220, 75%, 60%)', 'hsl(160, 70%, 55%)', 'hsl(140, 60%, 55%)'],
  getDiagnosis: (stats) => {
    const avgTemp = stats.Temperature_F || 0;
    const avgBP = stats.Blood_Pressure_Sys || 0;
    const avgSugar = stats.Sugar_Level_mg_dL || 0;

    if (avgTemp > 100.5 && avgBP < 135) return 'Viral Infection Group';
    if (avgBP > 145 && avgSugar > 165) return 'Cardiac & Metabolic Risk';
    if (avgSugar > 150 && avgTemp < 99) return 'Metabolic Risk Group';
    return 'Normal/Stable Group';
  },
};

// Crime Dataset Configuration
export const crimeConfig: DatasetConfig = {
  id: 'crime',
  name: 'Crime Sites',
  icon: 'map-pin',
  xAxis: { label: 'Longitude', key: 'Longitude' },
  yAxis: { label: 'Latitude', key: 'Latitude' },
  tooltipFields: [
    { label: 'Crime Type', key: 'Crime_Type' },
    { label: 'Time', key: 'Time_of_Day' },
    { label: 'Severity', key: 'Severity_Level', format: (v) => `Level ${v}` },
    { label: 'Reported By', key: 'Reported_By' },
  ],
  clusterColors: ['hsl(355, 85%, 50%)', 'hsl(30, 85%, 55%)', 'hsl(55, 75%, 60%)', 'hsl(210, 85%, 55%)'],
  getDiagnosis: (stats) => {
    const avgSeverity = stats.Severity_Level || 0;
    if (avgSeverity >= 4.5) return 'High-Risk Crime Hotspot';
    if (avgSeverity >= 3) return 'Medium-Risk Area';
    return 'Low-Risk Zone';
  },
};

// Customer Dataset Configuration
export const customerConfig: DatasetConfig = {
  id: 'customer',
  name: 'Customer Segmentation',
  icon: 'shopping-bag',
  xAxis: { label: 'Annual Income ($k)', key: 'Annual_Income_kUSD' },
  yAxis: { label: 'Spending Score', key: 'Spending_Score' },
  tooltipFields: [
    { label: 'Age', key: 'Age', format: (v) => `${v} years` },
    { label: 'Income', key: 'Annual_Income_kUSD', format: (v) => `$${v}k` },
    { label: 'Spending Score', key: 'Spending_Score', format: (v) => `${v}/100` },
    { label: 'Loyalty', key: 'Loyalty_Years', format: (v) => `${v} years` },
  ],
  clusterColors: ['hsl(280, 80%, 65%)', 'hsl(200, 75%, 60%)', 'hsl(330, 75%, 65%)', 'hsl(160, 70%, 55%)'],
  getDiagnosis: (stats) => {
    const avgIncome = stats.Annual_Income_kUSD || 0;
    const avgSpending = stats.Spending_Score || 0;

    if (avgIncome > 80 && avgSpending < 45) return 'Luxury Potential Segment';
    if (avgSpending > 75 && avgIncome < 50) return 'Fashion Forward Enthusiasts';
    if (avgIncome > 60 && avgSpending > 60) return 'High-Value Customers';
    return 'Value-Conscious Shoppers';
  },
};

export const DATASET_CONFIGS: Record<string, DatasetConfig> = {
  medical: medicalConfig,
  crime: crimeConfig,
  customer: customerConfig,
};

// Load CSV data
export const medicalData: MedicalPatient[] = [
  { Patient_ID: 'P1', Age: 25, Temperature_F: 98.6, Blood_Pressure_Sys: 120, Blood_Pressure_Dia: 80, Sugar_Level_mg_dL: 90, Symptoms: 'Mild fever, fatigue' },
  { Patient_ID: 'P2', Age: 27, Temperature_F: 99.1, Blood_Pressure_Sys: 118, Blood_Pressure_Dia: 78, Sugar_Level_mg_dL: 95, Symptoms: 'Mild fever, cough' },
  { Patient_ID: 'P3', Age: 35, Temperature_F: 101.5, Blood_Pressure_Sys: 130, Blood_Pressure_Dia: 85, Sugar_Level_mg_dL: 100, Symptoms: 'High fever, body pain' },
  { Patient_ID: 'P4', Age: 50, Temperature_F: 97.8, Blood_Pressure_Sys: 140, Blood_Pressure_Dia: 90, Sugar_Level_mg_dL: 160, Symptoms: 'Normal, slight fatigue' },
  { Patient_ID: 'P5', Age: 52, Temperature_F: 98.2, Blood_Pressure_Sys: 135, Blood_Pressure_Dia: 88, Sugar_Level_mg_dL: 155, Symptoms: 'Normal, mild headache' },
  { Patient_ID: 'P6', Age: 48, Temperature_F: 102.0, Blood_Pressure_Sys: 145, Blood_Pressure_Dia: 92, Sugar_Level_mg_dL: 170, Symptoms: 'High fever, cough, fatigue' },
  { Patient_ID: 'P7', Age: 60, Temperature_F: 100.8, Blood_Pressure_Sys: 150, Blood_Pressure_Dia: 95, Sugar_Level_mg_dL: 180, Symptoms: 'High BP, high sugar' },
  { Patient_ID: 'P8', Age: 62, Temperature_F: 101.2, Blood_Pressure_Sys: 155, Blood_Pressure_Dia: 98, Sugar_Level_mg_dL: 185, Symptoms: 'High BP, high sugar, dizziness' },
];

export const crimeData: CrimeSite[] = [
  { Crime_ID: 'C1', Latitude: 19.07, Longitude: 72.87, Crime_Type: 'Theft', Time_of_Day: 'Night', Severity_Level: 3, Reported_By: 'Citizen' },
  { Crime_ID: 'C2', Latitude: 19.05, Longitude: 72.85, Crime_Type: 'Assault', Time_of_Day: 'Evening', Severity_Level: 2, Reported_By: 'Police Patrol' },
  { Crime_ID: 'C3', Latitude: 19.09, Longitude: 72.84, Crime_Type: 'Burglary', Time_of_Day: 'Morning', Severity_Level: 4, Reported_By: 'Citizen' },
  { Crime_ID: 'C4', Latitude: 19.11, Longitude: 72.89, Crime_Type: 'Theft', Time_of_Day: 'Afternoon', Severity_Level: 3, Reported_By: 'Citizen' },
  { Crime_ID: 'C5', Latitude: 19.12, Longitude: 72.91, Crime_Type: 'Robbery', Time_of_Day: 'Night', Severity_Level: 5, Reported_By: 'Police Patrol' },
  { Crime_ID: 'C6', Latitude: 19.13, Longitude: 72.92, Crime_Type: 'Assault', Time_of_Day: 'Night', Severity_Level: 2, Reported_By: 'Citizen' },
  { Crime_ID: 'C7', Latitude: 19.08, Longitude: 72.83, Crime_Type: 'Theft', Time_of_Day: 'Evening', Severity_Level: 3, Reported_By: 'Citizen' },
  { Crime_ID: 'C8', Latitude: 19.06, Longitude: 72.86, Crime_Type: 'Fraud', Time_of_Day: 'Morning', Severity_Level: 1, Reported_By: 'Online' },
  { Crime_ID: 'C9', Latitude: 19.04, Longitude: 72.88, Crime_Type: 'Theft', Time_of_Day: 'Afternoon', Severity_Level: 2, Reported_By: 'Citizen' },
  { Crime_ID: 'C10', Latitude: 19.1, Longitude: 72.9, Crime_Type: 'Murder', Time_of_Day: 'Night', Severity_Level: 5, Reported_By: 'Police Patrol' },
  { Crime_ID: 'C11', Latitude: 19.15, Longitude: 72.93, Crime_Type: 'Burglary', Time_of_Day: 'Evening', Severity_Level: 4, Reported_By: 'Online' },
  { Crime_ID: 'C12', Latitude: 19.14, Longitude: 72.94, Crime_Type: 'Assault', Time_of_Day: 'Morning', Severity_Level: 3, Reported_By: 'Citizen' },
  { Crime_ID: 'C13', Latitude: 19.16, Longitude: 72.95, Crime_Type: 'Robbery', Time_of_Day: 'Night', Severity_Level: 5, Reported_By: 'Police Patrol' },
  { Crime_ID: 'C14', Latitude: 19.03, Longitude: 72.82, Crime_Type: 'Fraud', Time_of_Day: 'Afternoon', Severity_Level: 2, Reported_By: 'Citizen' },
  { Crime_ID: 'C15', Latitude: 19.02, Longitude: 72.81, Crime_Type: 'Theft', Time_of_Day: 'Morning', Severity_Level: 1, Reported_By: 'Online' },
  { Crime_ID: 'C16', Latitude: 19.17, Longitude: 72.96, Crime_Type: 'Assault', Time_of_Day: 'Evening', Severity_Level: 3, Reported_By: 'Citizen' },
  { Crime_ID: 'C17', Latitude: 19.18, Longitude: 72.97, Crime_Type: 'Murder', Time_of_Day: 'Night', Severity_Level: 5, Reported_By: 'Police Patrol' },
  { Crime_ID: 'C18', Latitude: 19.01, Longitude: 72.8, Crime_Type: 'Fraud', Time_of_Day: 'Afternoon', Severity_Level: 1, Reported_By: 'Online' },
  { Crime_ID: 'C19', Latitude: 19.19, Longitude: 72.98, Crime_Type: 'Burglary', Time_of_Day: 'Night', Severity_Level: 4, Reported_By: 'Citizen' },
  { Crime_ID: 'C20', Latitude: 19.2, Longitude: 72.99, Crime_Type: 'Robbery', Time_of_Day: 'Evening', Severity_Level: 5, Reported_By: 'Police Patrol' },
];

export const customerData: Customer[] = [
  { Customer_ID: 'CU1', Age: 22, Annual_Income_kUSD: 15, Spending_Score: 82, Loyalty_Years: 1, Preferred_Category: 'Fashion' },
  { Customer_ID: 'CU2', Age: 45, Annual_Income_kUSD: 35, Spending_Score: 55, Loyalty_Years: 5, Preferred_Category: 'Electronics' },
  { Customer_ID: 'CU3', Age: 35, Annual_Income_kUSD: 60, Spending_Score: 70, Loyalty_Years: 3, Preferred_Category: 'Groceries' },
  { Customer_ID: 'CU4', Age: 28, Annual_Income_kUSD: 20, Spending_Score: 90, Loyalty_Years: 2, Preferred_Category: 'Fashion' },
  { Customer_ID: 'CU5', Age: 52, Annual_Income_kUSD: 85, Spending_Score: 40, Loyalty_Years: 7, Preferred_Category: 'Luxury' },
  { Customer_ID: 'CU6', Age: 41, Annual_Income_kUSD: 70, Spending_Score: 60, Loyalty_Years: 4, Preferred_Category: 'Groceries' },
  { Customer_ID: 'CU7', Age: 30, Annual_Income_kUSD: 40, Spending_Score: 75, Loyalty_Years: 3, Preferred_Category: 'Fashion' },
  { Customer_ID: 'CU8', Age: 48, Annual_Income_kUSD: 55, Spending_Score: 65, Loyalty_Years: 6, Preferred_Category: 'Electronics' },
  { Customer_ID: 'CU9', Age: 25, Annual_Income_kUSD: 18, Spending_Score: 85, Loyalty_Years: 1, Preferred_Category: 'Fashion' },
  { Customer_ID: 'CU10', Age: 33, Annual_Income_kUSD: 25, Spending_Score: 88, Loyalty_Years: 2, Preferred_Category: 'Groceries' },
  { Customer_ID: 'CU11', Age: 55, Annual_Income_kUSD: 95, Spending_Score: 35, Loyalty_Years: 8, Preferred_Category: 'Luxury' },
  { Customer_ID: 'CU12', Age: 60, Annual_Income_kUSD: 100, Spending_Score: 20, Loyalty_Years: 10, Preferred_Category: 'Luxury' },
  { Customer_ID: 'CU13', Age: 27, Annual_Income_kUSD: 22, Spending_Score: 92, Loyalty_Years: 1, Preferred_Category: 'Fashion' },
  { Customer_ID: 'CU14', Age: 31, Annual_Income_kUSD: 30, Spending_Score: 78, Loyalty_Years: 3, Preferred_Category: 'Fashion' },
  { Customer_ID: 'CU15', Age: 44, Annual_Income_kUSD: 65, Spending_Score: 68, Loyalty_Years: 5, Preferred_Category: 'Electronics' },
  { Customer_ID: 'CU16', Age: 38, Annual_Income_kUSD: 45, Spending_Score: 72, Loyalty_Years: 4, Preferred_Category: 'Groceries' },
  { Customer_ID: 'CU17', Age: 50, Annual_Income_kUSD: 80, Spending_Score: 45, Loyalty_Years: 7, Preferred_Category: 'Luxury' },
  { Customer_ID: 'CU18', Age: 62, Annual_Income_kUSD: 110, Spending_Score: 25, Loyalty_Years: 9, Preferred_Category: 'Luxury' },
  { Customer_ID: 'CU19', Age: 40, Annual_Income_kUSD: 50, Spending_Score: 60, Loyalty_Years: 6, Preferred_Category: 'Electronics' },
  { Customer_ID: 'CU20', Age: 29, Annual_Income_kUSD: 28, Spending_Score: 80, Loyalty_Years: 2, Preferred_Category: 'Fashion' },
];

export function convertToDataPoints(dataset: 'medical' | 'crime' | 'customer'): DataPoint[] {
  const config = DATASET_CONFIGS[dataset];
  
  switch (dataset) {
    case 'medical':
      return medicalData.map((patient) => ({
        id: patient.Patient_ID,
        x: (patient as any)[config.xAxis.key],
        y: (patient as any)[config.yAxis.key],
        data: patient,
      }));
    case 'crime':
      return crimeData.map((crime) => ({
        id: crime.Crime_ID,
        x: (crime as any)[config.xAxis.key],
        y: (crime as any)[config.yAxis.key],
        data: crime,
      }));
    case 'customer':
      return customerData.map((customer) => ({
        id: customer.Customer_ID,
        x: (customer as any)[config.xAxis.key],
        y: (customer as any)[config.yAxis.key],
        data: customer,
      }));
  }
}
