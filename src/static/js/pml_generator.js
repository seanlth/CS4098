function save_generated_pml(pml, callback){
    var content = btoa(pml); // encode editor content

    $.ajax({
        url: '/tmp',
        data: { content: content },
        type: 'POST',
        success: callback,
        error: function(error) {
            console.log(error);
        }
    });
}

function add_requirements(requirements, current_indentation) {
    if ( requirements != "" ) {
	    var requirements_string = current_indentation + "requires { \n";
        requirements_string += current_indentation + "    " + requirements + "\n";
        requirements_string += current_indentation + "} \n";

        return requirements_string;
    }
    return "";
}

function add_provisions(provides, current_indentation) {
    if ( provides != "" ) {
	    var provides_string = current_indentation + "provides { \n";
        provides_string += current_indentation + "    " + provides + "\n";
        provides_string += current_indentation + "} \n";

        return provides_string;
    }
    return "";
}

function add_spec(spec, type, current_indentation) {
    if ( spec != "" ) {
	    var spec_string = current_indentation + type + " { \n";
        spec_string += current_indentation + "    " + spec + "\n";
        spec_string += current_indentation + "} \n";

        return spec_string;
    }
    return "";
}

function add_script(script, current_indentation) {
    if ( script != "" ) {
	    var script_string = current_indentation + "script { \n";
        script_string += current_indentation + "    " + "\"" + script + "\"" + "\n";
        script_string += current_indentation + "} \n";

        return script_string;
    }
    return "";
}

function add_tool(tool, current_indentation) {
    if ( tool != "" ) {
	    var tool_string = current_indentation + "tool { \n";
        tool_string += current_indentation + "    " + "\"" + tool + "\"" + "\n";
        tool_string += current_indentation + "} \n";

        return tool_string;
    }
    return "";
}

function add_type(type) {
    if ( type != "none" ) {
        return " " + type;
    }
    return "";
}

// builds the action string
function add_action(action, current_indentation) {
	node = current_indentation + "action " + action.name + add_type(action.type) + " { \n";
	node += add_requirements(action.requires, current_indentation + "    ");
	node += add_provisions(action.provides, current_indentation + "    ");
 	node += add_spec(action.agent, "agent", current_indentation + "    ");
	node += add_tool(action.tool, current_indentation + "    ");
 	node += add_script(action.script, current_indentation + "    ");
	node += current_indentation + "}";

	return node;
}

// returns a single primative
function add_primitive(primitive, current_indentation) {
	var primitive_string = "";

    // a control structure
	if ( primitive.hasOwnProperty('control') ) {
		primitive_string = current_indentation + primitive.control + " " + primitive.name + " { \n";
		primitive_string += add_primitives(primitive.actions, current_indentation + "    ") + "\n";
		primitive_string += current_indentation + "}";
	}
	else { // an action
		primitive_string = add_action(primitive, current_indentation);
	}

	return primitive_string;
}

// adds branches, actions, iterations, sequences
function add_primitives(primitives, current_indentation) {
	var primitives_string = "";

	for ( var i = 0; i < primitives.length; i++ ) {
		var primitive = primitives[i];
		var node = add_primitive(primitive, current_indentation);
		primitives_string += node + "\n";
	}
	return primitives_string;
}

function json_to_pml(program) {
	var PML_code = "process " + program.name + " { \n";

	PML_code += add_primitives(program.actions, "    ") + "\n";
	PML_code += "}"

    save_generated_pml(PML_code, function(response) {  } );

	return PML_code;
}