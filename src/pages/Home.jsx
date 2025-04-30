import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MicrofrontendLoader from '../MicrofrontendLoader';

const HomePage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('https://crud-vip.vercel.app/api/users', {
                    params: {
                        page: page + 1, // Adjust for 1-based page
                        limit: rowsPerPage,
                    },
                });
                setUsers(response.data.data);
                setLoading(false);
            } catch (err) {
                setError('Error fetching data');
                setLoading(false);
            }
        };

        fetchUsers();
    }, [page, rowsPerPage]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to first page when rows per page changes
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
            <MicrofrontendLoader
                scriptUrl="https://table-mf-bundle.vercel.app/microfrontend-bundle.js"
                cssUrl="https://table-mf-bundle.vercel.app/tablemf.css"
                mountDivId="tableMF"
                globalVarName="tableMF"
                propsToPass={{
                    users, rowsPerPage, handleChangePage, handleChangeRowsPerPage, page
                }}
            />
        </>
    );
};

export default HomePage;
