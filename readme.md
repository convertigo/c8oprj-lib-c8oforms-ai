


# lib_C8Oforms_AI

Mashup Sequencer project


For more technical informations : [documentation](./project.md)

- [Installation](#installation)
- [Sequences](#sequences)
    - [AssistantUpdateForm](#assistantupdateform)
    - [Chat](#chat)
    - [GenerateJsonForm](#generatejsonform)


## Installation

1. In your Convertigo Studio click on ![](https://github.com/convertigo/convertigo/blob/develop/eclipse-plugin-studio/icons/studio/project_import.gif?raw=true "Import a project in treeview") to import a project in the treeview
2. In the import wizard

   ![](https://github.com/convertigo/convertigo/blob/develop/eclipse-plugin-studio/tomcat/webapps/convertigo/templates/ftl/project_import_wzd.png?raw=true "Import Project")
   
   paste the text below into the `Project remote URL` field:
   <table>
     <tr><td>Usage</td><td>Click the copy button at the end of the line</td></tr>
     <tr><td>To contribute</td><td>

     ```
     lib_C8Oforms_AI=git@github.com:convertigo/c8oprj-lib-c8oforms-ai.git:branch=develop
     ```
     </td></tr>
     <tr><td>To simply use</td><td>

     ```
     lib_C8Oforms_AI=git@github.com:convertigo/c8oprj-lib-c8oforms-ai/archive/develop.zip
     ```
     </td></tr>
    </table>
3. Click the `Finish` button. This will automatically import the __lib_C8Oforms_AI__ project


## Sequences

### AssistantUpdateForm

**variables**

<table>
<tr>
<th>name</th><th>comment</th>
</tr>
<tr>
<td>formJSON</td><td></td>
</tr>
<tr>
<td>messages</td><td></td>
</tr>
<tr>
<td>model</td><td></td>
</tr>
</table>

### Chat

**variables**

<table>
<tr>
<th>name</th><th>comment</th>
</tr>
<tr>
<td>form_id</td><td></td>
</tr>
<tr>
<td>language</td><td></td>
</tr>
<tr>
<td>message</td><td></td>
</tr>
<tr>
<td>reset</td><td></td>
</tr>
</table>

### GenerateJsonForm

**variables**

<table>
<tr>
<th>name</th><th>comment</th>
</tr>
<tr>
<td>mode</td><td>chat or completion</td>
</tr>
<tr>
<td>prompt</td><td></td>
</tr>
<tr>
<td>reset</td><td></td>
</tr>
</table>



