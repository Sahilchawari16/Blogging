import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();
const Google_Client_Id = process.env.Google_Client_Id;
const Google_Client_Secret = process.env.Google_Client_Secret;
export const Oauth2Client = new google.auth.OAuth2(Google_Client_Id, Google_Client_Secret, "postmessage");
