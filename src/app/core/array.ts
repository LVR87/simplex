// example: 
// 
// interface Array<T> {
// firstOrDefault(predicate: (item: T) => boolean): T;
// where(predicate: (item: T) => boolean): T[];
// orderBy(propertyExpression: (item: T) => any): T[];
// orderByDescending(propertyExpression: (item: T) => any): T[];
// orderByMany(propertyExpressions: [(item: T) => any]): T[];
// orderByManyDescending(propertyExpressions: [(item: T) => any]): T[];
// remove(item: T): boolean;
// add(item: T): void;
// addRange(items: T[]): void;
// removeRange(items: T[]): void;
// }


interface Array<T> {
	first(): T;
	last(): T;
	add(item: T, expression?: (item: T) => boolean): boolean;
	addRange(items: T[]): void;
	del(expression?: (item: T) => boolean): T[];
	notNull(expression?: (item: T) => boolean): T[];
	order(expression: (item: T) => any, revert?: boolean): T[];
	remove(item: T): boolean;
	removeRange(items: T[]): void;
}

(() => {
	if (!Array.prototype.first) {
		Array.prototype.first = function() {
			return (<Array<any>>this)[0];
		}
	}
	if (!Array.prototype.last) {
		Array.prototype.last = function() {
			return (<Array<any>>this).length == 0 ? null : (<Array<any>>this)[(<Array<any>>this).length-1];
		}
	}


	if (!Array.prototype.remove) {
		Array.prototype.remove = function(item: any): boolean {
			let index = (<Array<any>>this).indexOf(item);
			if (index >= 0) {
				(<Array<any>>this).splice(index, 1);
				return true;
			}
			return false;
		}
	}

	if (!Array.prototype.removeRange) {
		Array.prototype.removeRange = function(items: any[]): void {
			for (var i = 0; i < items.length; i++) {
				(<Array<any>>this).remove(items[i]);
			}
		}
	}


	if (!Array.prototype.add) {
		Array.prototype.add = function(item: any, expression?: (item: any) => boolean): boolean {
			let i = -1;
			if (!!expression)
				i = (<Array<any>>this).findIndex(f => { return !!expression ? !!expression(f) : !!f });
			else
				i = (<Array<any>>this).indexOf(item);

			if (i > -1)
				(<Array<any>>this)[i] = item;
			else
				(<Array<any>>this).push(item);

			return i > -1;
		}
	}

	if (!Array.prototype.addRange) {
		Array.prototype.addRange = function(items: any[]): void {
			for (var i = 0; i < items.length; i++) {
				(<Array<any>>this).push(items[i]);
			}
		}
	}
	if (!Array.prototype.notNull) {
		Array.prototype.notNull = function(expression?: (item: any) => boolean) {
			return (<Array<any>>this).filter(f => {
				if (expression)
					return !!expression(f);
				return !!f;
			});

		}
	}
	if (!Array.prototype.del) {
		Array.prototype.del = function(expression: (item: any) => boolean): any[] {
			let itens = (<Array<any>>this).filter(f => { return expression(f) });
			(<Array<any>>this).removeRange(itens);
			return itens;
		}
	}
	if (!Array.prototype.order) {
		Array.prototype.order = function(expression: (item: any) => any, revert?: boolean) {
			let result = [];
			var compareFunction = (item1: any, item2: any): number => {
				let order = expression(item1) > expression(item2) ? 1
					: expression(item2) > expression(item1) ? -1
						: 0;
				return revert ? order * -1 : order;
			}
			for (var i = 0; i < (<Array<any>>this).length; i++) {
				return (<Array<any>>this).sort(compareFunction);
			}
			return result;
		}
	}


	// private shortArray(array: any[], field: string, revert?: boolean) {
	//        return array.sort((a, b) => {
	//            let order : number = a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0;
	//            return +(revert ? order * -1 : order);
	//        });
	//    }
})();