import { getAccessToken } from './auth';

const SPREADSHEET_NAME = 'Mentorship Network Data';

async function findOrCreateSpreadsheet(): Promise<string> {
  const token = await getAccessToken();
  if (!token) throw new Error("No access token");

  // Search for existing spreadsheet
  const searchRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=name='${SPREADSHEET_NAME}' and mimeType='application/vnd.google-apps.spreadsheet' and trashed=false`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const searchData = await searchRes.json();
  
  if (searchData.files && searchData.files.length > 0) {
    return searchData.files[0].id;
  }

  // Create new spreadsheet
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      properties: {
        title: SPREADSHEET_NAME
      }
    })
  });
  
  const createData = await createRes.json();
  const spreadsheetId = createData.spreadsheetId;

  // Add headers
  await appendRow(spreadsheetId, ['Timestamp', 'Role', 'Name', 'Title/Focus', 'LinkedIn URL']);

  return spreadsheetId;
}

export async function appendRow(spreadsheetId: string, values: string[]) {
  const token = await getAccessToken();
  if (!token) throw new Error("No access token");

  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:append?valueInputOption=USER_ENTERED`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      values: [values]
    })
  });
  
  return res.json();
}

export async function saveUserDataToSheet(role: 'Mentor' | 'Mentee', data: { name: string, title: string, linkedin?: string }) {
  const spreadsheetId = await findOrCreateSpreadsheet();
  await appendRow(spreadsheetId, [
    new Date().toISOString(),
    role,
    data.name,
    data.title,
    data.linkedin || ''
  ]);
}
