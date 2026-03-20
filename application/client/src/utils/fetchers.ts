import $ from "jquery";
import { gzip } from "pako";

export async function fetchBinary(url: string): Promise<ArrayBuffer> {
  const result = await $.ajax({
    async: false,
    dataType: "binary",
    method: "GET",
    responseType: "arraybuffer",
    url,
  });
  return result;
}

export async function fetchJSON<T>(url: string, query: Record<string, string | number | undefined> = {}): Promise<T> {
  // const result = await $.ajax({
  //   async: false,
  //   dataType: "json",
  //   method: "GET",
  //   url,
  // });

  const queryText =  new URLSearchParams(
    Object.entries(query)
      .filter((obj): obj is [string, string | number] => obj[1] !== undefined)
      .map(([k, v]) => [k, v.toString()])
  );

  const fetched = await fetch(`${url}?${queryText}`, {
    method: "GET",
  });
  const result = await fetched.json();

  if(!fetched.ok) {
    console.error(fetched.status, result);
    throw new Error(`HTTP Error: ${fetched.status} (${fetched.statusText}) for ${url}`);
  }

  console.log(url, result);

  return result;
}

export async function sendFile<T>(url: string, file: File): Promise<T> {
  const result = await $.ajax({
    async: false,
    data: file,
    dataType: "json",
    headers: {
      "Content-Type": "application/octet-stream",
    },
    method: "POST",
    processData: false,
    url,
  });
  return result;
}

export async function sendJSON<T>(url: string, data: object): Promise<T> {
  const jsonString = JSON.stringify(data);
  const uint8Array = new TextEncoder().encode(jsonString);
  const compressed = gzip(uint8Array);

  const result = await $.ajax({
    async: false,
    data: compressed,
    dataType: "json",
    headers: {
      "Content-Encoding": "gzip",
      "Content-Type": "application/json",
    },
    method: "POST",
    processData: false,
    url,
  });
  return result;
}
