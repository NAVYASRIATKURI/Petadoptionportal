import LostFound from '../models/lostFoundModel.js';

export const getAllReports = async (req, res) => {
  try {
    console.log('Attempting to fetch lost and found reports...');
    const reports = await LostFound.find()
      .populate('reporter', 'firstName lastName')
      .sort({ createdAt: -1 });
    console.log('Successfully fetched reports:', reports);
    res.json(reports);
  } catch (error) {
    console.error('Detailed error in getAllReports:', error);
    res.status(500).json({ 
      message: 'Failed to fetch reports',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const createReport = async (req, res) => {
  try {
    console.log('Received report data:', req.body);
    const report = await LostFound.create({
      ...req.body,
      reporter: req.user._id
    });
    console.log('Created report:', report);
    res.status(201).json(report);
  } catch (error) {
    console.error('Error in createReport:', error);
    res.status(500).json({ 
      message: 'Error creating report',
      error: error.message,
      details: error.errors 
    });
  }
};

export const updateReport = async (req, res) => {
  try {
    const report = await LostFound.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.json(report);
  } catch (error) {
    console.error('Error in updateReport:', error);
    res.status(500).json({ message: 'Error updating report' });
  }
};