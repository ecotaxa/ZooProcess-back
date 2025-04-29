import * as fs from 'fs';
import * as path from 'path';
import DriveAccessException from '../exceptions/DriveAccessException';

interface DriveInfo {
  name: string;
  url: string;
}

/**
 * Checks if a directory exists and is writable, or attempts to create it
 * @param directoryPath The path to check or create
 * @param drive Optional drive information from project
 * @returns True if directory exists and is writable
 * @throws MissingDataException with detailed error information
 */
export function ensureDirectoryExists(directoryPath: string, drive?: DriveInfo): boolean {
  try {
    // Check if directory exists
    if (fs.existsSync(directoryPath)) {
      // Test write permissions by attempting to create a temporary file
      const testFile = path.join(directoryPath, `.write-test-${Date.now()}`);
      fs.writeFileSync(testFile, '');
      fs.unlinkSync(testFile);
      return true;
    } else {
      // Directory doesn't exist, try to create it
      fs.mkdirSync(directoryPath, { recursive: true });
      return true;
    }
  } catch (error: any) {
    // Handle different error types
    if (error.code === 'EACCES') {
      // Permission denied error
      const driveInfo = drive ? `Drive "${drive.name}" at URL "${drive.url}"` : 'No drive information available';
      throw new DriveAccessException(`Permission denied: Cannot access or create directory at "${directoryPath}". ${driveInfo}. Please check if the network drive is mounted and you have write permissions.`,directoryPath);
    } else if (error.code === 'ENOENT') {
      // Path doesn't exist (parent directory doesn't exist)
      throw new DriveAccessException(`Directory path "${directoryPath}" cannot be created because parent directory doesn't exist. Please check if the network drive is mounted.`,directoryPath);
    } else {
      // Other errors
      throw new DriveAccessException(`Error accessing directory "${directoryPath}": ${error.message}`,directoryPath);
    }
  }
}
