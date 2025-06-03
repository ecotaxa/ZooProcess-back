const { isRoleAllowed } = require("../routes/validate_tags");
const path = require('path');
const fs = require('fs');
const { randomInt } = require("crypto");


// Récupère le ROOT_PATH depuis l'environnement
const ROOT_PATH = process.env.ROOT_PATH || path.join(process.cwd(), 'public');

// Nom du sous-dossier à scanner 
const folder = 'test/1';
const folderPath = path.join(ROOT_PATH, folder);

function getMatrixAndMaskNames(scanFilename) {
  const base = scanFilename.replace(/\.jpg$/, '');
  return {
    matrix: `${base}_mask.gz`,
    mask: `${base}_mask.png`,
  };
}



module.exports = {


 
   list: async (req, res) => {
    // Liste tous les fichiers .jpg dans le dossier
    console.debug("list /vignettes")
    let files = [];
    try {
        console.debug("📁📁 folderPath:", folderPath)
      files = fs.readdirSync(folderPath)
        .filter(f => f.endsWith('.jpg'));
    } catch (e) {
      console.error("❌ Impossible de lire le dossier :", e);
      return res.status(500).send("Erreur serveur (lecture dossier)");
    }

    // Génère le mockData pour chaque image
    const mockDataArr = files.map(scanFilename => {
      const { matrix, mask } = getMatrixAndMaskNames(scanFilename);

      // Check si le PNG mask existe déjà
      const maskPath = path.join(folderPath, mask);
      const maskExists = fs.existsSync(maskPath);

      return {
        scan: scanFilename,
        matrix,
        mask: maskExists ? mask : undefined,
        vignettes: Array(randomInt(5)).fill(scanFilename),
      };
    });

    const mockList = Array.from({ length: 200 }).flatMap(() => mockDataArr);

    return res.status(200).json({
      data: mockList,
      folder
    });
  }

}
