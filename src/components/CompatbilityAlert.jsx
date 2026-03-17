import React from 'react';

const T = {
    red: '#ff4444',
    redDim: 'rgba(255, 68, 68, 0.1)',
    orange: '#ff9500',
    orangeDim: 'rgba(255, 149, 0, 0.1)',
    text: '#f5f5f5',
    textDim: '#888'
};

export default function CompatibilityAlert({ compatibility }) {
    if (!compatibility) return null;

    const { errors = [], warnings = [] } = compatibility;

    if (errors.length === 0 && warnings.length === 0) return null;

    return (
        <div style={{ marginTop: '1.5rem' }}>
            {/* Red box for errors */}
            {errors.length > 0 && (
                <div style={{
                    background: T.redDim,
                    border: `1px solid ${T.red}44`,
                    borderRadius: 8,
                    padding: '1rem',
                    marginBottom: warnings.length > 0 ? '1rem' : 0
                }}>
                    {/* Error icon + title */}
                    {/* Map through errors and display message + parts */}
                </div>
            )}

            {/* Orange box for warnings */}
            {warnings.length > 0 && (
                <div style={{
                    background: T.orangeDim,
                    border: `1px solid ${T.orange}44`,
                    borderRadius: 8,
                    padding: '1rem'
                }}>
                    {/* Warning icon + title */}
                    {/* Map through warnings and display message + parts */}
                </div>
            )}
        </div>
    );
}