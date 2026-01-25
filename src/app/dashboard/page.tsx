"use client";
import * as React from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

export default function DashboardPage() {
	return (
		<Box sx={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
			<Stack spacing={4} direction="row">
				<Link href="/client">
					<Button variant="contained" color="primary" size="large">Client Management</Button>
				</Link>
				<Link href="/karigar">
					<Button variant="outlined" color="primary" size="large">Karigar Management</Button>
				</Link>
				<Link href="/profit">
					<Button variant="outlined" color="secondary" size="large">Profit & Loss</Button>
				</Link>
			</Stack>
		</Box>
	);
}