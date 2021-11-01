//格式化树数据
export function toTreeData(data) {
	var pos = {};
	var tree = [];
	var i = 0;
	while(data.length != 0) {
		if(data[i].pid == null || data[i].pid == 0) {
			tree.push({
				id: data[i].id,
                name: data[i].name,
                total: data[i].total,
                tb: data[i].tb,
				children: []
			});
			pos[data[i].id] = [tree.length - 1];
			data.splice(i, 1);
			i--;
		} else {
			var posArr = pos[data[i].pid];
			if(posArr != undefined) {
 
				var obj = tree[posArr[0]];
				for(var j = 1; j < posArr.length; j++) {
					obj = obj.children[posArr[j]];
				}
 
				obj.children.push({
					id: data[i].id,
                    name: data[i].name,
                    total: data[i].total,
                    tb: data[i].tb,
					children: []
				});
				pos[data[i].id] = posArr.concat([obj.children.length - 1]);
				data.splice(i, 1);
				i--;
			}
		}
		i++;
		if(i > data.length - 1) {
			i = 0;
		}
	}
	return tree;
}