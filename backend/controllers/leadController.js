const Lead = require('../models/Lead');

// @desc    Get all leads with filtering, searching, sorting, pagination and database aggregates
// @route   GET /api/leads
// @access  Public
const getLeads = async (req, res, next) => {
  try {
    const { status, search, sort, order, page = 1, limit = 10 } = req.query;

    let query = {};

    // Status filtering
    if (status && status !== 'All') {
      query.status = status;
    }

    // Searching across name, email, and company
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
      ];
    }

    // Pagination calculations
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    // Sorting
    let sortQuery = {};
    if (sort) {
      sortQuery[sort] = order === 'desc' ? -1 : 1;
    } else {
      sortQuery['createdAt'] = -1; // Default: newest first
    }

    const totalLeads = await Lead.countDocuments(query);
    const leads = await Lead.find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(limitNum);

    // Compute global metrics/stats across the entire DB
    const allStatsGroup = await Lead.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const stats = {
      New: 0,
      Contacted: 0,
      Qualified: 0,
      Converted: 0,
      Lost: 0,
      Total: 0,
    };

    let totalDBLeads = 0;
    allStatsGroup.forEach((item) => {
      if (item._id in stats) {
        stats[item._id] = item.count;
      }
      totalDBLeads += item.count;
    });
    stats.Total = totalDBLeads;

    res.status(200).json({
      leads,
      page: pageNum,
      pages: Math.ceil(totalLeads / limitNum),
      total: totalLeads,
      stats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single lead by ID
// @route   GET /api/leads/:id
// @access  Public
const getLeadById = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      res.status(404);
      throw new Error('Lead not found');
    }
    res.status(200).json(lead);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new lead
// @route   POST /api/leads
// @access  Public
const createLead = async (req, res, next) => {
  try {
    const { name, email, phone, company, status, notes } = req.body;

    if (!name || !email) {
      res.status(400);
      throw new Error('Please provide name and email');
    }

    const leadExists = await Lead.findOne({ email });
    if (leadExists) {
      res.status(400);
      throw new Error('A lead with this email address already exists');
    }

    const lead = await Lead.create({
      name,
      email,
      phone,
      company,
      status,
      notes,
    });

    res.status(201).json(lead);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a lead
// @route   PUT /api/leads/:id
// @access  Public
const updateLead = async (req, res, next) => {
  try {
    const { name, email, phone, company, status, notes } = req.body;

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      res.status(404);
      throw new Error('Lead not found');
    }

    // Check email uniqueness if email is being changed
    if (email && email.toLowerCase() !== lead.email) {
      const emailExists = await Lead.findOne({ email });
      if (emailExists) {
        res.status(400);
        throw new Error('A lead with this email address already exists');
      }
    }

    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, company, status, notes },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedLead);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a lead
// @route   DELETE /api/leads/:id
// @access  Public
const deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      res.status(404);
      throw new Error('Lead not found');
    }

    await Lead.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Lead successfully deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
};
