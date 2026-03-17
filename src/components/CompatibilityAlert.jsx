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
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                        <span style={{ color: T.red, fontSize: 18, marginTop: 1 }}>⚠</span>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 10, color: T.red, letterSpacing: 2, marginBottom: 8, fontWeight: 600 }}>
                                COMPATIBILITY ERRORS
                            </div>
                            {errors.map((error, i) => (
                                <div key={i} style={{ marginBottom: i < errors.length - 1 ? 12 : 0 }}>
                                    <div style={{ fontSize: 12, color: T.text, marginBottom: 4 }}>
                                        {error.message}
                                    </div>
                                    {error.parts && (
                                        <div style={{ fontSize: 11, color: T.textDim, paddingLeft: 12 }}>
                                            {Object.entries(error.parts).map(([key, value]) => (
                                                <div key={key}>• {key}: {value}</div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
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
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                        <span style={{ color: T.orange, fontSize: 18, marginTop: 1 }}>⚡</span>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 10, color: T.orange, letterSpacing: 2, marginBottom: 8, fontWeight: 600 }}>
                                COMPATIBILITY WARNINGS
                            </div>
                            {warnings.map((warning, i) => (
                                <div key={i} style={{ marginBottom: i < warnings.length - 1 ? 12 : 0 }}>
                                    <div style={{ fontSize: 12, color: T.text, marginBottom: 4 }}>
                                        {warning.message}
                                    </div>
                                    {warning.parts && (
                                        <div style={{ fontSize: 11, color: T.textDim, paddingLeft: 12 }}>
                                            {Object.entries(warning.parts).map(([key, value]) => (
                                                <div key={key}>• {key}: {value}</div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}