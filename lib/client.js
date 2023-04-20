import sanityClient from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const client = sanityClient({
  projectId: "jebapg6o",
  dataset: "production",
  apiVersion: "2022-05-17",
  useCdn: true,
  token: process.env.NEXT_SANITY_API_TOKEN,
});

const builder = imageUrlBuilder(client);

export const urlFor = (source) => builder.image(source);
