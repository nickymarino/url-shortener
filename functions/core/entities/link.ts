import { Dynamo } from "@/functions/core/dynamo";
import { Entity, UpdateEntityItem } from "electrodb";
import { ulid } from "ulid";

export const Link = new Entity(
  {
    model: {
      entity: "link",
      version: "1",
      service: "shorty",
    },
    attributes: {
      linkId: {
        type: "string",
        required: true,
      },
      shortPath: {
        type: "string",
        required: true,
      },
      url: {
        type: "string",
        required: true,
      },
      createdAt: {
        type: "number",
        readOnly: true,
        set: () => Date.now(),
      },
      updatedAt: {
        type: "number",
        readOnly: true,
        watch: "*",
        set: () => Date.now(),
      },
    },
    indexes: {
      byId: {
        pk: {
          field: "pk",
          composite: [],
        },
        sk: {
          field: "sk",
          composite: ["linkId"],
        },
      },
      byShortPath: {
        index: "gsi1",
        pk: {
          field: "gsi1pk",
          composite: ["shortPath"],
        },
        sk: {
          field: "gsi1sk",
          composite: [],
        },
      },
    },
  },
  Dynamo.Configuration
);

export async function create(shortPath: string, url: string) {
  const result = await Link.create({
    linkId: ulid(),
    shortPath,
    url,
  }).go();

  return result.data;
}

export async function get(linkId: string) {
  const result = await Link.get({ linkId }).go();
  return result.data;
}

export async function getByShortPath(shortPath: string) {
  const result = await Link.query.byShortPath({ shortPath }).go();
  return result.data;
}

type PatchAttributes = UpdateEntityItem<typeof Link>;

export async function patch(linkId: string, newAttributes: PatchAttributes) {
  const result = await Link.patch({ linkId }).set(newAttributes).go({
    response: "all_new",
  });
  console.log({ result });
  return result.data;
}

export async function list() {
  const result = await Link.query.byId({}).go();
  return result.data;
}
