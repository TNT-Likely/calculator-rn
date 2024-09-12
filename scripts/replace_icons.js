const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 不同密度对应的宽度和高度
const sizes = {
  mdpi: { width: 48, height: 48 },
  hdpi: { width: 72, height: 72 },
  xhdpi: { width: 96, height: 96 },
  xxhdpi: { width: 144, height: 144 },
  xxxhdpi: { width: 192, height: 192 }
};

// Android 图标路径
const iconFolders = {
  mdpi: path.resolve(__dirname, '..', 'android', 'app', 'src', 'main', 'res', 'mipmap-mdpi'),
  hdpi: path.resolve(__dirname, '..', 'android', 'app', 'src', 'main', 'res', 'mipmap-hdpi'),
  xhdpi: path.resolve(__dirname, '..', 'android', 'app', 'src', 'main', 'res', 'mipmap-xhdpi'),
  xxhdpi: path.resolve(__dirname, '..', 'android', 'app', 'src', 'main', 'res', 'mipmap-xxhdpi'),
  xxxhdpi: path.resolve(__dirname, '..', 'android', 'app', 'src', 'main', 'res', 'mipmap-xxxhdpi')
};

// 源图标路径
const sourceIconPath = path.resolve(__dirname, '..', 'assets', 'launcher.png');

// 输出临时文件夹
const tempFolder = path.resolve(__dirname, '..', '.temp');
const outputFolder = path.resolve(tempFolder, 'icons');

// 确保输出文件夹存在
if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder, { recursive: true });
}

// 生成并替换图标
async function generateAndReplaceIcons() {
  for (const density in sizes) {
    const size = sizes[density];
    const destinationPath = path.join(outputFolder, `ic_launcher-${density}.png`);

    try {
      // 缩放图标
      await sharp(sourceIconPath)
        .resize(size.width, size.height)
        .toFile(destinationPath);

      console.log(`Generated regular icon: ${destinationPath}`);

      // 替换原有图标
      const targetIconPath = path.join(iconFolders[density], 'ic_launcher.png');
      fs.copyFileSync(destinationPath, targetIconPath);

      const targetRadiusIconPath = path.join(iconFolders[density], 'ic_launcher_round.png');
      fs.copyFileSync(destinationPath, targetRadiusIconPath);
      console.log(`Copied ${destinationPath} to ${targetIconPath}`);
    } catch (err) {
      console.error(`Error processing icons for ${density}:`, err);
    }
  }
}

// 清理临时文件夹
function cleanupTempFolder() {
  fs.readdir(tempFolder, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join(tempFolder, file), (unlinkErr) => {
        if (unlinkErr) throw unlinkErr;
      });
    }

    fs.rmdir(tempFolder, (rmdirErr) => {
      if (rmdirErr) throw rmdirErr;
    });
  });
}

// 运行生成和替换图标功能
generateAndReplaceIcons()