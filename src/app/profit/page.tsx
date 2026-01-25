"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import * as api from "@/lib/api";
import Client from "@/types/Client";
import Karigar from "@/types/Karigar";

interface Row {
  siteName: string;
  totalSiteBill: number;
  clientPaid: number;
  clientRemaining: number;
  karigarSiteBill: number;
  karigarPaid: number;
  karigarPending: number;
  estimatedMargin: number;
  remarks?: string;
}

export default function ProfitPage() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = React.useState<Row[]>([]);

  React.useEffect(() => {
    (async () => {
      try {
        const [sitesResp, clientsResp, karigarsResp] = await Promise.allSettled([
          api.getSites(),
          api.getClients(),
          api.getKarigars(),
        ]);

        const clients: Client[] =
          clientsResp.status === "fulfilled" && Array.isArray(clientsResp.value)
            ? clientsResp.value
            : [];
        const karigars: Karigar[] =
          karigarsResp.status === "fulfilled" && Array.isArray(karigarsResp.value)
            ? karigarsResp.value
            : [];

        // sites may not expose a flat list; if getSites fails, build site names from clients/karigars
        let siteNames: string[] = [];
        if (sitesResp.status === "fulfilled" && Array.isArray(sitesResp.value)) {
          siteNames = sitesResp.value.map((s: any) => s.siteName || s.name || s.id).filter(Boolean);
        }
        // fallback: union of site names from clients and karigars
        const fromClients = clients.map((c) => c.siteName).filter(Boolean as any);
        const fromKarigars = karigars.map((k) => k.siteName).filter(Boolean as any);
        siteNames = Array.from(new Set([...siteNames, ...fromClients, ...fromKarigars]));

        const computed: Row[] = siteNames.map((site) => {
          const siteClients = clients.filter((c) => c.siteName === site);
          const siteKarigars = karigars.filter((k) => k.siteName === site);

          const totalSiteBill = siteClients.reduce((s, c) => s + Number(c.siteBill || 0), 0);
          const clientRemaining = siteClients.reduce((s, c) => s + Number(c.paymentRemaining || 0), 0);
          const clientPaid = totalSiteBill - clientRemaining;

          const karigarSiteBill = siteKarigars.reduce((s, k) => s + Number(k.karigarSiteBill || 0), 0);
          const karigarPaid = siteKarigars.reduce((s, k) => s + Number(k.paymentAmount || 0), 0);
          const karigarPending = siteKarigars.reduce((s, k) => s + Number(k.remainingAmount || 0), 0);

          const estimatedMargin = totalSiteBill - karigarSiteBill;

          return {
            siteName: site,
            totalSiteBill,
            clientPaid,
            clientRemaining,
            karigarSiteBill,
            karigarPaid,
            karigarPending,
            estimatedMargin,
            remarks: "",
          };
        });

        setRows(computed);
      } catch (err) {
        console.error("Failed to build profit rows", err);
        setRows([]);
      }
    })();
  }, []);

  const handleChangePage = (e: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(0);
  };

  const totalMargin = rows.reduce((s, r) => s + r.estimatedMargin, 0);

  return (
    <Box>
      <Paper>
        <TableContainer sx={{ minHeight: "60vh" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Site Name</TableCell>
                <TableCell align="right">Total Site Bill</TableCell>
                <TableCell align="right">Client Payment Done</TableCell>
                <TableCell align="right">Remaining Client Payment</TableCell>
                <TableCell align="right">Karigar Site Bill</TableCell>
                <TableCell align="right">Karigar Payment Done</TableCell>
                <TableCell align="right">Karigar Pending</TableCell>
                <TableCell align="right">Estimated Margin</TableCell>
                <TableCell>Remarks</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow key={row.siteName} hover>
                    <TableCell>{row.siteName}</TableCell>
                    <TableCell align="right">{row.totalSiteBill.toLocaleString()}</TableCell>
                    <TableCell align="right">{row.clientPaid.toLocaleString()}</TableCell>
                    <TableCell align="right">{row.clientRemaining.toLocaleString()}</TableCell>
                    <TableCell align="right">{row.karigarSiteBill.toLocaleString()}</TableCell>
                    <TableCell align="right">{row.karigarPaid.toLocaleString()}</TableCell>
                    <TableCell align="right">{row.karigarPending.toLocaleString()}</TableCell>
                    <TableCell align="right">{row.estimatedMargin.toLocaleString()}</TableCell>
                    <TableCell>{row.remarks}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Box mt={2} display="flex" justifyContent="flex-end">
        <Typography variant="h6">Total Estimated Margin: {totalMargin.toLocaleString()}</Typography>
      </Box>
    </Box>
  );
}
