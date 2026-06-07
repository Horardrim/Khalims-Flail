export interface NavItem {
  path: string;
  label: string;
  children?: NavItem[];
}

export const navItems: NavItem[] = [
  {
    path: 'order',
    label: '排序算法',
    children: [
      { path: 'order/quick-sort', label: '快速排序可视化' }
    ]
  },
  {
    path: 'leetcode',
    label: 'LeetCode',
    children: [
      { path: 'leetcode/array-partition', label: '数组分区' },
      { path: 'leetcode/remove-duplicates-i', label: '删除重复项 I' },
      { path: 'leetcode/remove-duplicates', label: '删除重复项 II' }
    ]
  },
  {
    path: 'alg',
    label: '数据结构',
    children: [
      { 
        path: 'alg/tree', 
        label: '树',
        children: [
          { path: 'alg/tree/bintree', label: '二叉树遍历' },
          { path: 'alg/tree/bptree', label: 'B+ 树' }
        ]
      }
    ]
  }
];