import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { Role } from '../../backend';

interface PlayerFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  roleFilter: Role | 'all';
  onRoleFilterChange: (role: Role | 'all') => void;
}

export default function PlayerFilters({
  searchQuery,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
}: PlayerFiltersProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search players or teams..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={roleFilter} onValueChange={(value) => onRoleFilterChange(value as Role | 'all')}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value={Role.batsman}>Batsman</SelectItem>
              <SelectItem value={Role.bowler}>Bowler</SelectItem>
              <SelectItem value={Role.allRounder}>All-Rounder</SelectItem>
              <SelectItem value={Role.keeper}>Wicket Keeper</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
