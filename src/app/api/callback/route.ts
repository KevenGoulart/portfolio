import axios, { AxiosError } from "axios";
import { NextRequest } from "next/server";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const PORT = process.env.AUTH_SETUP_PORT;

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const code = searchParams.get('code')?.toString()

  try {
    const response = await axios({
      method: "post",
      url: "https://accounts.spotify.com/api/token",
      params: {
        grant_type: "authorization_code",
        code: code,
        redirect_uri: `http://localhost:${PORT}/callback`,
      },
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const refresh_token = response.data.refresh_token;
    console.log("Refresh Token:", refresh_token);
    return Response.json("Token received. Check your console.");
  } catch (error) {
    if(error instanceof AxiosError) {
        console.error(
            "Error:",
            error.response ? error.response.data : error.message
          );
    }
    return Response.json("Error occurred");
  }
}