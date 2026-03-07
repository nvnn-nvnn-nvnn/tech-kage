// routes/deleteAccount.js
const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase Admin Client with service role key
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // This has admin privileges
);

/**
 * DELETE /api/delete-account
 * Deletes a user account and all associated data
 * Requires userId in request body
 */
router.post('/delete-account', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ 
        error: 'Missing userId in request body' 
      });
    }

    console.log(`[DELETE ACCOUNT] Starting deletion for user: ${userId}`);

    // Step 1: Delete user's saved builds
    const { error: buildsError } = await supabaseAdmin
      .from('saved_builds')
      .delete()
      .eq('user_id', userId);

    if (buildsError) {
      console.error('[DELETE ACCOUNT] Error deleting builds:', buildsError);
      // Continue anyway - we want to delete the account even if builds fail
    } else {
      console.log('[DELETE ACCOUNT] Successfully deleted user builds');
    }

    // Step 2: Delete user's orders
    const { error: ordersError } = await supabaseAdmin
      .from('orders')
      .delete()
      .eq('user_id', userId);

    if (ordersError) {
      console.error('[DELETE ACCOUNT] Error deleting orders:', ordersError);
      // Continue anyway
    } else {
      console.log('[DELETE ACCOUNT] Successfully deleted user orders');
    }

    // Step 3: Delete the auth user (this is the critical step that requires admin privileges)
    const { data, error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteUserError) {
      console.error('[DELETE ACCOUNT] Error deleting auth user:', deleteUserError);
      return res.status(500).json({ 
        error: 'Failed to delete user account',
        details: deleteUserError.message 
      });
    }

    console.log('[DELETE ACCOUNT] Successfully deleted user account:', userId);

    return res.status(200).json({ 
      success: true,
      message: 'Account successfully deleted',
      userId 
    });

  } catch (error) {
    console.error('[DELETE ACCOUNT] Unexpected error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

module.exports = router;
