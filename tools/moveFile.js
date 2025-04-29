const fs = require('fs');
const path = require('path');

// Replace your current fs.rename with this function
function moveFile(source, destination) {
  return new Promise((resolve, reject) => {


    // test if source exists
    if (!fs.existsSync(source)) {
        // test if destination exists
        if (!fs.existsSync(destination)) {
            console.error("Source & destination files do not exist.");
            return reject(new Error(`Source file ${source} does not exist.`));
        } else {
            // destination already present
            console.log("Source not present but destination already exist. Already moved?")
            resolve()
        }
    }

    // First try renaming (faster if on same device)
    fs.rename(source, destination, (renameErr) => {
      if (!renameErr) {
        return resolve();
      }
      
      // If rename fails with EXDEV, use copy+delete approach
      if (renameErr.code === 'EXDEV') {
        console.log("Cross-device move detected, using copy+delete instead");
        
        // Create a read stream from the source file
        const readStream = fs.createReadStream(source);
        // Create a write stream to the destination file
        const writeStream = fs.createWriteStream(destination);
        
        // Pipe the read stream to the write stream
        readStream.pipe(writeStream);
        
        // Handle completion of the write operation
        writeStream.on('finish', () => {
          // Delete the original file after successful copy
          console.log("File wrote successfully")
          fs.unlink(source, (unlinkErr) => {
            if (unlinkErr) {
              console.warn("Warning: Could not delete original file after copy:", unlinkErr);
              // Still consider the operation successful even if delete fails
            }
            console.debug("file removed successfully");
            resolve();
          });
        });
        
        // Handle errors during the copy operation
        readStream.on('error', copyErr => { console.error("Can't read the file"); reject(copyErr) });
        writeStream.on('error', copyErr => { 
          if (copyErr.code === 'ENOSPC')  { console.error("No space left on device");}
          console.error("Can't write the file"); 
          reject(copyErr)});
      } else {
        // If it's not an EXDEV error, reject with the original error
        console.fdebug("Can't rename")
        reject(renameErr);
      }
    });
  });
}

module.exports = { moveFile };
