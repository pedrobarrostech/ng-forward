import {Module} from '../module/module';

export function decorateDirective(t, name, type, binder){
	t.$component = t.$component || {};
	t.$provider = t.$provider || {};

	t.$provider.name = name;
	t.$provider.type = 'directive';
	t.$component.restrict = type;

	if(binder)
	{
		t.$component.bindToController = true;
		t.$component.scope = t.$component.scope || {};

		for(let bind in binder){
			t.$component.scope[bind] = binder[bind];
		}
	}
}

Module.registerProvider('directive', (provider, module) => {
	let name = provider.$provider.name;
	let controller = provider;
	let component = controller.$component;
	delete controller.$component;
	delete controller.$provider;

	component.controllerAs = component.controllerAs || controller.name;
	component.controller = controller;
	component.link = controller.link || function(){};
	component.compile = controller.compile || function(){};

	module.directive(name, function(){
		return component;
	});
});