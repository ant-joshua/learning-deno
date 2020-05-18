import {
  Request,
  Response,
  RouteParams,
  State,
} from "../../deps.ts";
import db from "../../db.ts";
import { Category } from "../models/category.ts";

const database = db.getDatabase;
const categories = database.collection("categories");

export const getCategories = async (
  { state, request, response }: {
    state: State;
    request: Request;
    response: Response;
  },
) => {
  const fetchedCategories: Category[] = await categories.find();

  if (fetchedCategories) {
    const list = fetchedCategories.length
      ? fetchedCategories.map((category) => {
        const { _id : { $oid }, name } = category;
        return { id: $oid, name };
      })
      : [];

    response.body = list;
    return;
  }
  response.body = JSON.stringify({ errors: "errors" });
  return;
};

export const createCategory = async (
  { request, response }: { request: Request; response: Response },
) => {
  try {
    const body = await request.body();

    if (!Object.keys(body.value).length) {
      response.status = 422;
      response.body = JSON.stringify({ errors: "Error" });
    }
    const { value : { name } } = body;

    const insertedCategory = await categories.insertOne({
      name,
    });

    response.body = JSON.stringify({ mantul: insertedCategory });
  } catch (error) {
    console.log(error);
  }
};

export const getCategory = async (
  { params, response }: { params: RouteParams; response: Response },
) => {
  try {
    const { id } = params;

    const fetchedCategory = await categories.findOne({ _id: { "$oid": id } });

    if (fetchedCategory) {
      const { _id: { $oid }, name, age, salary } = fetchedCategory;
      response.body = JSON.stringify({ id: $oid, name });
      response.headers.set("Content-Type", "application/json");
      response.status = 200;
      return;
    }

    response.body = JSON.stringify({ message: "Not Found" });
    response.status = 404;
    return;
  } catch (error) {
    response.status = 500;
  }
};

export const updateCategory = async (
  { params, request, response }: {
    params: RouteParams;
    request: Request;
    response: Response;
  },
) => {
  try {
    const { id } = params;
    const body = await request.body();

    const { value : { name } } = body;

    const fetchedCategory = await categories.findOne({ _id: { "$oid": id } });

    if (fetchedCategory) {
      const { matchedCount } = await categories.updateOne(
        { _id: { "$oid": id } },
        { $set: body.value },
      );
      if (matchedCount) {
        response.status = 204;
        response.body = "Category Updated";
        return;
      }
      response.status = 400;
      response.body = "Unable to update";
      return;
    }
    response.status = 404;
    response.body = "Category Not Found";
    // const
  } catch (error) {
    response.status = 500;
    response.body = error;
  }
};
export const deleteCategory = async (
  { params, response }: { params: RouteParams; response: Response },
) => {
  try {
    const { id } = params;

    const fetchedCategory = await categories.findOne({ _id: { "$oid": id } });

    if (fetchedCategory) {
      const deleteCount = await categories.deleteOne({ _id: { "$oid": id } });
      if (deleteCount) {
        response.status = 204;
        response.body = "Category Deleted";
        return;
      }
      response.status = 400;
      response.body = "Unable to Delete";
      return;
    }
    response.status = 404;
    response.body = "Category Not Found";
    return;
  } catch (error) {
    response.status = 500;
    response.body = error;
    return;
  }
};
