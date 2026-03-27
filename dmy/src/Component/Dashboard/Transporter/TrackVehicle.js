import React from 'react';
import Navbar from '../../Common/navbar';
import '../../../Style/TransporterHomepage.css';

const TrackVehicle = () => {
    return (
        <div className="dashboard">
            <Navbar />
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <h2 style={{ color: '#2f855a', fontSize: '32px', marginBottom: '20px' }}>Track My Vehicle</h2>
                <div style={{ background: '#fff', padding: '30px', borderRadius: '16px', boxShadow: '0 8px 20px rgba(0,0,0,0.1)', maxWidth: '800px', margin: '0 auto' }}>
                    <p>Live tracking of your vehicles will appear here.</p>
                    <div style={{ height: '300px', background: '#e0e0e0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '20px' }}>
                        <span style={{ color: '#666' }}>[ Map Placeholder ]</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackVehicle;
