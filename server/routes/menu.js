const express = require('express');
const router = express.Router();
const { menuItems } = require('../data/store');
const { asyncHandler } = require('../middleware/errorHandler');

// GET /api/menu — all menu items grouped by category
router.get('/', asyncHandler(async (req, res) => {
  res.json({ success: true, data: menuItems });
}));

// GET /api/menu/:category — specific category
router.get('/:category', asyncHandler(async (req, res) => {
  const { category } = req.params;
  const { tags } = req.query;

  if (!menuItems[category]) {
    return res.status(404).json({ success: false, error: `Category '${category}' not found. Available: ${Object.keys(menuItems).join(', ')}` });
  }

  let items = menuItems[category];
  if (tags) {
    const tagList = tags.split(',').map(t => t.trim().toLowerCase());
    items = items.filter(item => tagList.some(tag => item.tags.includes(tag)));
  }

  res.json({ success: true, category, count: items.length, data: items });
}));

module.exports = router;
