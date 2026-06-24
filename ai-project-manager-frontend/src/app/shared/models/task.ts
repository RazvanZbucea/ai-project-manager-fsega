export interface Task {
  id: number,
  title: string,
  description: string,
  status: string,
  createdAt: string,
  updatedAt: string,
  createdBy: string,
  updatedBy: string,
  assignedName: string,
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}
