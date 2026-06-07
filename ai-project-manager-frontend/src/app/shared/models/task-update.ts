interface TaskUpdate {
  title: string,
  description: string,
  status: string,
  assignedName: string,
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}
