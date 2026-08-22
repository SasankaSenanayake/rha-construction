// Runs on CloudFront Viewer Request. S3's REST origin does not resolve
// directory index files, so this rewrites clean URLs to their concrete
// index.html object, and sends the bare "/" to the default locale.
function handler(event) {
  var request = event.request;
  var uri = request.uri;

  if (uri === "/") {
    return {
      statusCode: 302,
      statusDescription: "Found",
      headers: { location: { value: "/en/" } },
    };
  }

  if (uri.endsWith("/")) {
    request.uri = uri + "index.html";
    return request;
  }

  if (!uri.includes(".")) {
    request.uri = uri + "/index.html";
    return request;
  }

  return request;
}
