"use server";

import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "../_config";
import { Resource } from "sst";
import { SaveResponse } from "../_type";

export const saveTodo = async (text: string): Promise<SaveResponse> => {
  try {
    await docClient.send(
      new PutCommand({
        TableName: Resource.Todo.name,
        Item: {
          id: Math.random().toString(),
          text,
          completed: false,
        },
      })
    );
    return { statusCode: 200 };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, error: "Internal server error" };
  }
};
