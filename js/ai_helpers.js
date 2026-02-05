include("./js/common.js");

var normalizeProjectList = function(projects) {
	if (projects == null) {
		return [];
	}
	if (projects.project != null) {
		projects = projects.project;
	}
	if (!Array.isArray(projects)) {
		projects = [projects];
	}
	return projects;
};

var normalizeSequences = function(project) {
	var sequences = project ? project.sequences : null;
	if (sequences == null && project && project.sequence != null) {
		sequences = project.sequence;
	}
	if (sequences == null) {
		return [];
	}
	if (sequences.sequence != null) {
		sequences = sequences.sequence;
	}
	if (!Array.isArray(sequences)) {
		sequences = [sequences];
	}
	return sequences;
};

var extractVariables = function(sequence) {
	if (sequence == null || sequence.variables == null) {
		return [];
	}
	var variables = sequence.variables;
	if (variables.name != null) {
		if (Array.isArray(variables.name)) {
			return variables.name;
		}
		return [variables.name];
	}
	if (Array.isArray(variables)) {
		var list = [];
		for (var i = 0; i < variables.length; i++) {
			if (variables[i] && variables[i].name != null) {
				list.push(variables[i].name);
			}
		}
		return list;
	}
	return [];
};

var resolveProjects = function(res) {
	if (res == null) {
		return null;
	}
	if (res.projects != null || res.project != null) {
		return res.projects || res.project;
	}
	if (res.document != null) {
		return res.document.projects || res.document.project || null;
	}
	if (res.doc != null) {
		return res.doc.projects || res.doc.project || (res.doc.document ? (res.doc.document.projects || res.doc.document.project) : null);
	}
	return null;
};

var buildAvailableFromProjects = function(seqPattern, varPattern) {
	var Engine = com.twinsoft.convertigo.engine.Engine;
	var projList = Engine.theApp.databaseObjectsManager.getAllProjectNamesList();
	var projects = [];
	var seqRe = new RegExp(seqPattern);
	var varRe = new RegExp(varPattern);
	var arr = projList.toArray();
	for (var i = 0; i < arr.length; i++) {
		var projectName = "" + arr[i];
		var prj = Engine.theApp.databaseObjectsManager.getOriginalProjectByName(projectName);
		if (prj == null) {
			continue;
		}
		var seqs = prj.getSequencesList();
		var seqArr = seqs.toArray();
		var sequences = [];
		for (var j = 0; j < seqArr.length; j++) {
			var seq = seqArr[j];
			if (seq == null) {
				continue;
			}
			var seqName = "" + seq.getName();
			if (!seqRe.test(seqName)) {
				continue;
			}
			var vars = [];
			try {
				var varsList = seq.getVariablesList();
				var varsArr = varsList.toArray();
				for (var k = 0; k < varsArr.length; k++) {
					var varName = "" + varsArr[k].getName();
					if (varRe.test(varName)) {
						vars.push(varName);
					}
				}
			} catch (e) {
			}
			sequences.push({ name: seqName, variables: vars });
		}
		if (sequences.length > 0) {
			projects.push({ project: projectName, sequences: sequences });
		}
	}
	return projects;
};

var buildAvailableFromGetSequences = function(sequenceFilter, variableFilter) {
	var res = callSequence("C8Oforms", "GetSequences", {
		projectFilter: "",
		sequenceFilter: sequenceFilter,
		variableFilter: variableFilter
	});
	var projects = resolveProjects(res);
	var list = normalizeProjectList(projects);
	var output = [];
	for (var i = 0; i < list.length; i++) {
		var project = list[i];
		var projectName = project ? (project.name || project.project) : null;
		var sequences = normalizeSequences(project);
		var seqOut = [];
		for (var j = 0; j < sequences.length; j++) {
			var seq = sequences[j];
			if (seq == null || seq.name == null) {
				continue;
			}
			seqOut.push({
				name: seq.name,
				variables: extractVariables(seq)
			});
		}
		if (seqOut.length > 0 && projectName != null) {
			output.push({
				project: projectName,
				sequences: seqOut
			});
		}
	}
	if (output.length > 0) {
		return output;
	}
	return buildAvailableFromProjects(sequenceFilter, variableFilter);
};

var getAvailableActions = function() {
	return buildAvailableFromGetSequences("^forms_", "^forms_");
};

var getAvailableSources = function() {
	return buildAvailableFromGetSequences("^formssource_", "^forms_");
};
