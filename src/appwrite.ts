import { Client, Databases, ID } from "appwrite";

const client = new Client();

client
  .setEndpoint("https://fra.cloud.appwrite.io/v1") 
  .setProject("686c48d3000d2a2afd0c");

const databases = new Databases(client);

export { databases, ID };
