// Get ClientId and ClientSecret from https://dashboard.groupdocs.cloud (free registration is required).

const conversion_cloud = require("groupdocs-conversion-cloud");

const clientId = "XXXX-XXXX-XXXX-XXXX";
const clientSecret = "XXXXXXXXXXXXXXXX";

const convertApi = conversion_cloud.ConvertApi.fromKeys(clientId, clientSecret);

let settings = new conversion_cloud.ConvertSettings();
settings.filePath = "";
settings.format = "mp4";
settings.outputPath = "ConvertedFiles";

let result = await convertApi.convertDocument(new conversion_cloud.ConvertDocumentRequest(settings));