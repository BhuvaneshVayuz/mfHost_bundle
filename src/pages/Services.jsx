// ./pages/Services.js

import React from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';

const services = [
    { title: 'Web Development', description: 'We build fast, responsive, and scalable websites.' },
    { title: 'UI/UX Design', description: 'Crafting intuitive and beautiful user interfaces.' },
    { title: 'Mobile Apps', description: 'Creating cross-platform apps using React Native.' },
];

const Services = () => {
    return (
        <div className="px-4 py-10 max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Our Services</h2>
            <Grid container spacing={4}>
                {services.map((service, index) => (
                    <Grid item xs={12} md={4} key={index}>
                        <Card sx={{ minHeight: 200 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {service.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {service.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default Services;
