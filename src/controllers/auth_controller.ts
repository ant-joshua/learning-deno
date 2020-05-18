import { Request, Response, config } from "../../deps.ts";
import {
  makeJwt,
  setExpiration,
  Jose,
  Payload,
} from "../../deps.ts";
import db from "../../db.ts";
import { User } from "../models/user.ts";

const database = db.getDatabase;
const users = database.collection("users");

const key = config().APP_KEY;

export const login = async (
  { request, response }: { request: Request; response: Response },
) => {
  response.headers.set("Content-Type", "application/json");
  let hasBody = await request.hasBody;

  if (!hasBody) {
    response.status = 422;
    response.body = JSON.stringify({ errors: "Error" });
    return;
  }
  let body = await (await request.body()).value;
  if (body.value == undefined || !Object.keys(body.value).length) {
    response.status = 422;
    response.body = JSON.stringify({ errors: "Error" });
  }
  let value = body;
  let username = value.username;
  let password = value.password;

  // console.log(username, password);
  // Find Username & Password in DB
  let findUser: User = await users.findOne(
    { username: value.username ?? "", password: value.password ?? "" },
  );

  console.log(findUser);

  if (findUser) {
    // Set JWT payload
    const payload: Payload = {
      iss: value.username,
      // 1 Hour Expired
      exp: setExpiration(new Date().getTime() + (60000 * 60)),
    };
    // Use HS256 (HMAC with SHA-256)
    const header: Jose = {
      alg: "HS256",
      typ: "JWT",
    };
    // Make JWT Payload
    let responseData = {
      data: {
        username: value.username,
        token: makeJwt({ header, payload, key }),
      },
    };
    response.body = JSON.stringify(responseData);
    response.status = 200;
    return;
  }

  response.body = "Username or Password not exists";
  response.status = 401;
};

export const getAllUser = async (
  { request, response }: { request: Request; response: Response },
) => {
  try {
    let getUsers: User[] = await users.find();

    let userList = getUsers.map((user) => {
      const { _id : { $oid }, username, password } = user;
      return { id: $oid, username, password };
    }) ?? [];

    response.body = userList;
    response.status = 200;
    return;
  } catch (error) {
    console.log(error);
    response.body = error;
    response.status = 500;
  }
};

export const register = async (
  { request, response }: { request: Request; response: Response },
) => {
  try {
    const body = (await request.body()).value;
    const { username, password } = body;

    if (!Object.keys(body).length) {
      response.status = 422;
      response.body = JSON.stringify({ errors: "Error" });
    }

    const insertUser = await users.insertOne({
      username,
      password,
    });

    response.body = JSON.stringify({ message: "berhasil" });
  } catch (error) {
    console.log(error);
  }
};
