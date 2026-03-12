const express = require('express');
const { supabase } = require('../config/supabase');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

// Get all saved builds for the authenticated user
router.get('/builds', authenticateUser, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('saved_builds')
            .select('*')
            .eq('user_id', req.user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json(data);
    } catch (error) {
        console.error('Error fetching builds:', error);
        res.status(500).json({ error: 'Failed to fetch builds' });
    }
});

// Get a specific build by ID
router.get('/builds/:id', authenticateUser, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('saved_builds')
            .select('*')
            .eq('id', req.params.id)
            .eq('user_id', req.user.id)
            .single();

        if (error) throw error;

        if (!data) {
            return res.status(404).json({ error: 'Build not found' });
        }

        res.json(data);
    } catch (error) {
        console.error('Error fetching build:', error);
        res.status(500).json({ error: 'Failed to fetch build' });
    }
});

// Save a new build
router.post('/builds', authenticateUser, async (req, res) => {
    try {
        const { build_name, description, parts, total_price } = req.body;

        if (!build_name || !parts) {
            return res.status(400).json({ error: 'Build name and parts are required' });
        }

        const { data, error } = await supabase
            .from('saved_builds')
            .insert({
                user_id: req.user.id,
                build_name,
                description: description || null,
                parts,
                total_price
            })
            .select()
            .single();

        if (error) throw error;

        res.status(201).json(data);
    } catch (error) {
        console.error('Error saving build:', error);
        res.status(500).json({ error: 'Failed to save build' });
    }
});

// Update an existing build
router.put('/builds/:id', authenticateUser, async (req, res) => {
    try {
        const { build_name, description, parts, total_price } = req.body;

        const { data, error } = await supabase
            .from('saved_builds')
            .update({
                build_name,
                description,
                parts,
                total_price,
                updated_at: new Date().toISOString()
            })
            .eq('id', req.params.id)
            .eq('user_id', req.user.id)
            .select()
            .single();

        if (error) throw error;

        if (!data) {
            return res.status(404).json({ error: 'Build not found' });
        }

        res.json(data);
    } catch (error) {
        console.error('Error updating build:', error);
        res.status(500).json({ error: 'Failed to update build' });
    }
});

// Delete a build
router.delete('/builds/:id', authenticateUser, async (req, res) => {
    try {
        const { error } = await supabase
            .from('saved_builds')
            .delete()
            .eq('id', req.params.id)
            .eq('user_id', req.user.id);

        if (error) throw error;

        res.json({ message: 'Build deleted successfully' });
    } catch (error) {
        console.error('Error deleting build:', error);
        res.status(500).json({ error: 'Failed to delete build' });
    }
});

module.exports = router;
