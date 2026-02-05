// Minimal shared helpers for lib_C8Oforms_AI
// (Copied/adapted from C8Oforms js/common.js for factorization)

var theApp = com.twinsoft.convertigo.engine.Engine.theApp;
var InternalHttpServletRequest = com.twinsoft.convertigo.engine.requesters.InternalHttpServletRequest;
var InternalRequester = com.twinsoft.convertigo.engine.requesters.InternalRequester;
var HashMap = java.util.HashMap;
var XmlToJson = com.twinsoft.convertigo.engine.util.XMLUtils.XmlToJson;
var enums = com.twinsoft.convertigo.engine.enums;

var toJSON = function (json) {
	return JSON.parse(json.toString());
};

var callSequence = function (project, sequence, parametersJS, request, logParameters) {
	var parameters = new HashMap();
	var __project = java.lang.reflect.Array.newInstance(java.lang.String, 1);
	__project[0] = project;
	parameters.put("__project", __project);
	parameters.put("__sequence", sequence);
	parameters.put("__context", "syncContext_" + java.lang.System.currentTimeMillis());
	var keys = Object.keys(parametersJS || {});
	for (var i = 0; i < keys.length; i++) {
		if (parametersJS[keys[i]] != null) {
			parameters.put(keys[i], parametersJS[keys[i]]);
		}
	}
	var req = request;
	if (req == null) {
		if (typeof context != "undefined" && context != null && context.httpServletRequest != null) {
			req = context.httpServletRequest;
		} else {
			req = new InternalHttpServletRequest();
		}
	}
	var requester = new InternalRequester(parameters, req);
	var response = requester.processRequest();
	response = toJSON(XmlToJson(response.getDocumentElement(), true, true, enums.JsonOutput.JsonRoot.docNode));
	var mdcParams = logParameters;
	if (mdcParams == null && typeof context != "undefined" && context != null) {
		mdcParams = context.logParameters;
	}
	if (mdcParams != null) {
		org.apache.log4j.MDC.put("ContextualParameters", mdcParams);
	}
	var ctx2 = requester.getContext();
	theApp.contextManager.remove(ctx2);
	return response;
};

var getCurrentHttpSessionAttributes = function () {
	var httpSessionAttributes = {};
	if (context.httpSession == null) {
		return httpSessionAttributes;
	}
	var names = context.httpSession.getAttributeNames();
	while (names.hasMoreElements()) {
		var name = names.nextElement();
		if (name != "__c8o:contexts__") {
			httpSessionAttributes[name] = context.httpSession.getAttribute(name);
		}
	}
	return httpSessionAttributes;
};

var callSequenceInDuplicateSession = function (project, sequence, parametersJS, httpSessionAttributes) {
	var session = null;
	var requester = null;
	try {
		var parameters = new HashMap();
		var __project = java.lang.reflect.Array.newInstance(java.lang.String, 1);
		__project[0] = project;
		parameters.put("__project", __project);
		parameters.put("__sequence", sequence);
		parameters.put("__context", "syncContext_" + java.lang.System.currentTimeMillis());
		var keys = Object.keys(parametersJS || {});
		for (var i = 0; i < keys.length; i++) {
			if (parametersJS[keys[i]] != null) {
				parameters.put(keys[i], parametersJS[keys[i]]);
			}
		}
		var request = new InternalHttpServletRequest();
		session = request.getSession(true);
		if (httpSessionAttributes == null) {
			httpSessionAttributes = getCurrentHttpSessionAttributes();
		}
		var sessionKeys = Object.keys(httpSessionAttributes || {});
		for (var j = 0; j < sessionKeys.length; j++) {
			session.setAttribute(sessionKeys[j], httpSessionAttributes[sessionKeys[j]]);
		}
		requester = new InternalRequester(parameters, request);
		var response = requester.processRequest();
		response = toJSON(XmlToJson(response.getDocumentElement(), true, true, enums.JsonOutput.JsonRoot.docNode));
		if (typeof context != "undefined" && context != null && context.logParameters != null) {
			org.apache.log4j.MDC.put("ContextualParameters", context.logParameters);
		}
		var ctx2 = requester.getContext();
		theApp.contextManager.remove(ctx2);
		return response;
	} finally {
		if (session != null) {
			try {
				session.invalidate();
			} catch (e) {
			}
		}
	}
};

// Streams OpenAI chat.completions tokens (SSE) and calls opts.onChunk(fullText, token)
// opts: { onChunk: function(full, token){}, stopFlag: AtomicBoolean, temperature: number, maxTokens: number, responseFormat: object }
var streamChatCompletions = function (apiKey, model, messages, opts) {
	if (apiKey == null || ("" + apiKey).trim().length == 0) {
		throw new java.lang.Exception("Missing OpenAI API key");
	}
	if (model == null || ("" + model).trim().length == 0) {
		model = "gpt-4o";
	}
	if (!Array.isArray(messages)) {
		messages = [];
	}
	var baseBody = {
		model: "" + model,
		stream: true,
		messages: messages
	};
	if (opts != null && opts.responseFormat != null) {
		baseBody.response_format = opts.responseFormat;
	}
	if (opts != null && opts.temperature != null) {
		baseBody.temperature = opts.temperature;
	}
	if (opts != null && opts.maxTokens != null) {
		baseBody.max_tokens = opts.maxTokens;
	}
	var fullText = "";

	var executeStream = function (body, allowRetryWithoutTemperature) {
		var url = new java.net.URL("https://api.openai.com/v1/chat/completions");
		var conn = url.openConnection();
		conn.setRequestMethod("POST");
		conn.setDoOutput(true);
		conn.setUseCaches(false);
		conn.setConnectTimeout(15000);
		conn.setReadTimeout(0);
		conn.setRequestProperty("Accept", "text/event-stream");
		conn.setRequestProperty("Content-Type", "application/json");
		conn.setRequestProperty("Authorization", "Bearer " + apiKey);

		var payload = JSON.stringify(body);
		var os = null;
		var reader = null;
		try {
			os = conn.getOutputStream();
			os.write(new java.lang.String(payload).getBytes("UTF-8"));
			os.flush();
			os.close();
			os = null;

			var code = conn.getResponseCode();
			var input = null;
			if (code >= 200 && code < 300) {
				input = conn.getInputStream();
			} else {
				input = conn.getErrorStream();
				var errTxt = "";
				if (input != null) {
					reader = new java.io.BufferedReader(new java.io.InputStreamReader(input, "UTF-8"));
					var errLine = null;
					while ((errLine = reader.readLine()) != null) {
						errTxt += (errTxt.length > 0 ? "\n" : "") + ("" + errLine);
					}
					try { reader.close(); } catch (eClose1) {}
					reader = null;
				}

				var shouldRetryWithoutTemperature = false;
				if (allowRetryWithoutTemperature === true && body.temperature != null) {
					if (code == 400 && errTxt != null && errTxt.length > 0) {
						try {
							var errObj = JSON.parse(errTxt);
							var errParam = "";
							var errMessage = "";
							if (errObj != null && errObj.error != null) {
								if (errObj.error.param != null) {
									errParam = "" + errObj.error.param;
								}
								if (errObj.error.message != null) {
									errMessage = "" + errObj.error.message;
								}
							}
							if (errParam == "temperature" || (errMessage.indexOf("temperature") != -1 && errMessage.indexOf("Unsupported value") != -1)) {
								shouldRetryWithoutTemperature = true;
							}
						} catch (eErr) {
						}
					}
				}
				if (shouldRetryWithoutTemperature) {
					var retryBody = {
						model: body.model,
						stream: true,
						messages: body.messages
					};
					if (body.max_tokens != null) {
						retryBody.max_tokens = body.max_tokens;
					}
					return executeStream(retryBody, false);
				}
				throw new java.lang.Exception("OpenAI stream HTTP " + code + (errTxt.length > 0 ? (": " + errTxt) : ""));
			}

			reader = new java.io.BufferedReader(new java.io.InputStreamReader(input, "UTF-8"));
			var line = null;
			while ((line = reader.readLine()) != null) {
				if (opts != null && opts.stopFlag != null && opts.stopFlag.get != null) {
					if (!opts.stopFlag.get()) {
						break;
					}
				}
				line = "" + line;
				if (line.length == 0 || line.indexOf("data:") != 0) {
					continue;
				}
				var data = line.substring(5).trim();
				if (data.length == 0) {
					continue;
				}
				if (data == "[DONE]") {
					break;
				}
				var chunk = null;
				try {
					chunk = JSON.parse(data);
				} catch (eParse) {
					chunk = null;
				}
				if (chunk != null && chunk.choices != null && chunk.choices.length > 0) {
					var delta = chunk.choices[0].delta;
					var token = "";
					if (delta != null) {
						// Legacy shape: delta.content is a string
						if (typeof delta.content == "string") {
							token = delta.content;
						}
						// Newer shape: delta.content is an array of parts
						else if (delta.content != null && Array.isArray(delta.content)) {
							for (var ci = 0; ci < delta.content.length; ci++) {
								var part = delta.content[ci];
								if (part == null) {
									continue;
								}
								if (typeof part == "string") {
									token += part;
									continue;
								}
								if (part.text != null) {
									token += "" + part.text;
									continue;
								}
								if (part.value != null) {
									token += "" + part.value;
									continue;
								}
							}
						}
						// Additional fallback shapes
						if (token.length == 0) {
							if (delta.text != null) {
								token = "" + delta.text;
							} else if (delta.output_text != null) {
								token = "" + delta.output_text;
							}
						}
					}
					if (token.length > 0) {
						fullText += token;
						if (opts != null && opts.onChunk != null) {
							opts.onChunk(fullText, token);
						}
					}
				}
			}
		} finally {
			if (reader != null) {
				try { reader.close(); } catch (eClose2) {}
			}
			if (os != null) {
				try { os.close(); } catch (eClose3) {}
			}
			try { conn.disconnect(); } catch (eClose4) {}
		}
		return fullText;
	};

	executeStream(baseBody, true);
	return fullText;
};
