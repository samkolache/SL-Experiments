import { Component, OnInit } from '@angular/core';
import { DatePipe, JsonPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ThemeSwitcherComponent } from '../../../shared/theme-switcher/theme-switcher.component';
import { DataTableComponent } from '../tables/tables.component';
import { DT_DIRECTIVES } from '../tables/tables.directives';
import { DEFAULT_TABLE_QUERY, TableColumn, TableQuery } from '../tables/tables.model';

interface Order {
  orderNumber: string;
  clientName: string;
  state: string;
  teamName: string;
  lender: string;
  createdDate: string;
  elapsed: string;
  breached: boolean;
  lockedBy?: string;
}

const STATES = ['TX', 'CA', 'CO', 'IL', 'NY', 'FL', 'AZ'];
const CLIENTS = ['Northgate Title', 'Coastal Escrow', 'Summit Lending Group of the Rocky Mountain Region', 'Prairie Home Loans', 'Bayline Mortgage'];
const TEAMS = ['Closing East', 'Closing West', 'Closing Central'];
const LENDERS = ['First National Bank', 'Harbor Credit Union', 'Pinnacle Mortgage', 'Evergreen Lending'];

@Component({
  selector: 'app-sam-index',
  standalone: true,
  imports: [RouterLink, ThemeSwitcherComponent, DataTableComponent, DT_DIRECTIVES, DatePipe, JsonPipe],
  templateUrl: './sam-index.component.html',
  styleUrl: './sam-index.component.scss'
})
export class SamIndexComponent implements OnInit {

  // ── ClosingSpa-style: server-driven ─────────────────────────────────────

  orderColumns: TableColumn[] = [
    { id: 'orderNumber', header: 'Order #', field: 'orderNumber', width: 'md', sortable: true, filter: 'text', sticky: true },
    { id: 'client',  header: 'Client',  field: 'clientName', width: 'lg', sortable: true, filter: 'text', truncate: true },
    { id: 'state',   header: 'State',   field: 'state', width: 'sm', sortable: true, filter: { options: STATES.map(s => ({ label: s, value: s })) } },
    { id: 'team',    header: 'Team',    field: 'teamName', width: 'lg', filter: 'text' },
    { id: 'created', header: 'Created', field: 'createdDate', width: 'lg', sortable: true },
    { id: 'elapsed', header: 'Elapsed', field: 'elapsed', sortKey: 'createdDate', width: 'sm', sortable: true },
    { id: 'lender',  header: 'Lender',  field: 'lender', width: 'xl', filter: 'text' },
    { id: 'notes',   header: 'Notes',   field: 'notes' }
  ];

  ordersQuery: TableQuery = DEFAULT_TABLE_QUERY;
  orders: Order[] = [];
  ordersTotal = 0;
  ordersLoading = false;
  selectedOrders: Order[] = [];
  lastOpened = '';

  private allOrders = makeOrders(137);

  ngOnInit(): void {
    this.loadOrders(this.ordersQuery);
  }

  /** Stands in for an API call: filter, sort, then slice a page. */
  loadOrders(query: TableQuery): void {
    this.ordersQuery = query;
    this.ordersLoading = true;

    setTimeout(() => {
      let rows = this.allOrders.filter(order =>
        Object.entries(query.filters).every(([key, value]) =>
          key === 'createdAfter'
            ? order.createdDate >= String(value)
            : String((order as any)[key]).toLowerCase().includes(String(value).toLowerCase())));

      const sort = query.sort;
      if (sort) {
        const dir = sort.direction === 'asc' ? 1 : -1;
        rows = [...rows].sort((a, b) => String((a as any)[sort.key]).localeCompare(String((b as any)[sort.key])) * dir);
      }

      const start = (query.page - 1) * query.pageSize;
      this.ordersTotal = rows.length;
      this.orders = rows.slice(start, start + query.pageSize);
      this.ordersLoading = false;
    }, 400);
  }
}

function makeOrders(count: number): Order[] {
  const now = new Date('2026-09-14T12:00:00Z').getTime();
  return Array.from({ length: count }, (_, i) => {
    const hours = (i * 7) % 240;
    return {
      orderNumber: `CS-${240100 + i}`,
      clientName: CLIENTS[i % CLIENTS.length],
      state: STATES[i % STATES.length],
      teamName: TEAMS[i % TEAMS.length],
      lender: LENDERS[i % LENDERS.length],
      createdDate: new Date(now - hours * 3_600_000).toISOString(),
      elapsed: `${Math.floor(hours / 24)}d ${hours % 24}h`,
      breached: hours > 120,
      lockedBy: i % 6 === 0 ? 'J. Okafor' : undefined
    };
  });
}
