const fs = require("fs");

// Configs
let submission_files_path = "submission_files.json";
let submission_galleys_path = "submission_galleys.json";

let submission_files;
let submission_galleys;
let submission_list = [];

function LoadJsonFile() {
  try {
    submission_files = JSON.parse(
      fs.readFileSync(submission_files_path, "utf8")
    );
    submission_files = submission_files[2].data;
  } catch (parseError) {
    console.error("Error reading submission_files JSON file:", parseError);
  }

  try {
    submission_galleys = JSON.parse(
      fs.readFileSync(submission_galleys_path, "utf8")
    );
    submission_galleys = submission_galleys[2].data;
  } catch (parseError) {
    console.error("Error reading submission_galleys JSON file:", parseError);
  }
}

function GenerateFileName(file_id) {
  for (const key in submission_files) {
    if (submission_files[key].file_id == file_id) {
      const dateObject = new Date(submission_files[key].date_uploaded);
      const year = dateObject.getFullYear();
      const month = (dateObject.getMonth() + 1).toString().padStart(2, "0");
      const day = dateObject.getDate().toString().padStart(2, "0");
      const outputDateString = `${year}${month}${day}`;
      const parts = submission_files[key].original_file_name.split(".");
      return `${submission_files[key].submission_id}-${
        submission_files[key].genre_id
      }-${submission_files[key].file_id}-${submission_files[key].revision}-${
        submission_files[key].file_stage
      }-${outputDateString}.${parts[parts.length - 1]}`;
    }
  }
}

function CheckSubmissionList(submission_id) {
  for (const key in submission_list) {
    if (submission_list[key].ID == submission_id) {
      return;
    }
  }
  submission_list.push({
    ID: submission_id,
    Galley: [],
  });
  return;
}

LoadJsonFile();

for (const key in submission_galleys) {
  // if (submission_list[submission_galleys[key].submission_id] == null) {
  //   submission_list[submission_galleys[key].submission_id] = {
  //     ID: submission_galleys[key].submission_id,
  //     Galley: [],
  //   };
  // }

  CheckSubmissionList(submission_galleys[key].submission_id);

  for (const key2 in submission_list) {
    if(submission_list[key2].ID==submission_galleys[key].submission_id){
      submission_list[key2].Galley.push({
        galley_label: submission_galleys[key].label,
        file_name: GenerateFileName(submission_galleys[key].file_id),
      });
    }
  }

  // submission_list[submission_galleys[key].submission_id]["Galley"][
  //   submission_galleys[key].seq
  // ] = {
  //   galley_label: submission_galleys[key].label,
  //   file_name: GenerateFileName(submission_galleys[key].file_id),
  // };

}

fs.writeFile("ouput.json", JSON.stringify(submission_list), "utf8", (err) => {
  if (err) {
    console.error("Error writing JSON file:", err);
  } else {
    console.log("Data has been written to output.json");
  }
});
