const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        // Create user directory based on userId
        const userId = req.user?._id || 'anonymous';
        const userDir = path.join(uploadDir, userId.toString());
        
        if (!fs.existsSync(userDir)) {
            fs.mkdirSync(userDir, { recursive: true });
        }
        
        cb(null, userDir);
    },
    filename: function(req, file, cb) {
        // Generate unique filename: timestamp + original name
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
});

// Set file size limits and file types
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

// Route to upload a file
router.post('/upload-file', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                success: false,
                message: 'No file uploaded'
            });
        }
        
        // Create a file record
        const fileData = {
            filename: req.file.filename,
            originalName: req.file.originalname,
            path: req.file.path,
            size: req.file.size,
            mimetype: req.file.mimetype,
            userId: req.user?._id || 'anonymous',
            uploadDate: new Date()
        };
        
        res.status(201).json({
          
            file: fileData
        });
    } catch (error) {
        console.error('File upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading file',
            error: error.message
        });
    }
});

// Route to get all files for user
router.get('/files', async (req, res) => {
    try {
        const userId = req.user?._id || 'anonymous';
        const userDir = path.join(uploadDir, userId.toString());
        
        if (!fs.existsSync(userDir)) {
            return res.json({
                files: []
            });
        }
        
        // Read the user's directory
        const files = fs.readdirSync(userDir);
        
        // Map files to objects with metadata
        const fileList = files.map(filename => {
            const filePath = path.join(userDir, filename);
            const stats = fs.statSync(filePath);
            
            return {
                filename: filename,
                originalName: filename.substring(filename.indexOf('-') + 1),
                path: filePath,
                size: stats.size,
                uploadDate: stats.mtime
            };
        });
        
        res.json({
            files: fileList
        });
    } catch (error) {
        console.error('Error getting files:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving files',
            error: error.message
        });
    }
});

// Route to download a file
router.get('/files/:filename', (req, res) => {
    try {
        const userId = req.user?._id || 'anonymous';
        const filename = req.params.filename;
        const filePath = path.join(uploadDir, userId.toString(), filename);
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
               
                message: 'File not found'
            });
        }
        
        // Send the file
        res.download(filePath);
    } catch (error) {
        console.error('Error downloading file:', error);
        res.status(500).json({
           
            message: 'Error downloading file',
            error: error.message
        });
    }
});

// Route to delete a file
router.delete('/files/:filename', (req, res) => {
    try {
        const userId = req.user?._id || 'anonymous';
        const filename = req.params.filename;
        const filePath = path.join(uploadDir, userId.toString(), filename);
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
             
                message: 'File not found'
            });
        }
        
        // Delete the file
        fs.unlinkSync(filePath);
        
        res.json({
          
            message: 'File deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({
          
            message: 'Error deleting file',
            error: error.message
        });
    }
});

module.exports = router;