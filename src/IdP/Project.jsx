import React, { useState } from "react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";


 function Project() {
  const [projectName, setProjectName] = useState("");
  const [projectDate, setProjectDate] = useState("");
  const [sections, setSections] = useState([]);
  const [newSection, setNewSection] = useState("");

  const addSection = () => {
    if (newSection   &&    !sections.find((sec) => sec.name === newSection) ){
      setSections([...sections, { name: newSection, columns: ["Col1"], rows: [] }]);
      setNewSection("");
    }
  };

const addColumn = (sectionName) => {
    setSections(
      sections.map((sec) =>
        sec.name === sectionName
           ?{ ...sec, columns: [...sec.columns, `Col${sec.columns.length + 1}`] }
          : sec
      )
    );
  };

  const addRow = (sectionName) => {
    setSections(
      sections.map((sec) =>
        sec.name === sectionName
          ? { ...sec, rows: [...sec.rows, {}] }
          : sec
      )
    );
  };

  const removeRow = (sectionName, index) => {
    setSections(
      sections.map((sec) =>
        sec.name === sectionName
          ? { ...sec, rows: sec.rows.filter((_ , i) => i !== index) }
          : sec
      )
    );
  };

  const exportJSON = () => {
    const data = { projectName, projectDate, sections };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    saveAs(blob, "project_data.json");
  };

  const exportExcel = () => {
    const wb = XLSX.utils.book_new();
    sections.forEach((sec) => {
      const wsData = [sec.columns, ...sec.rows.map((row) => sec.columns.map((col) => row[col] || ""))];
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      XLSX.utils.book_append_sheet(wb, ws, sec.name);
    });
    XLSX.writeFile(wb, "project_data.xlsx");
  };

  return (
    <div className="main">
      <h1 className="h1">Project</h1>
          <div className="info">
            <input value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="Project Name" className="input" />
            <input type="date" value={projectDate} onChange={(e) => setProjectDate(e.target.value)} className="date"  />
         

            <input value={newSection} onChange={(e) => setNewSection(e.target.value)} placeholder="Section Name"  className="input2"/>
            <button onClick={addSection}  className="addsectionButton">Add Section</button>
          </div>


      {sections.map((section, sIndex) => (

        <div key={sIndex}  className="addSection">
          <h2>{section.name}</h2>
          <table >
            <thead>
              <tr>
                {section.columns.map((col, cIndex) => (
                  <th key={cIndex} >{col}</th>
              ))}

                <th><button onClick={() => addColumn(section.name)} className="newcol">+NewCol</button></th>
              </tr>
            </thead>


            <tbody>
              {section.rows.map((row, rIndex) => (
                <tr key={rIndex}>
                  {section.columns.map((col, cIndex) => (
                    <td key={cIndex} >
                      <input value={row[col] || ""} onChange={(e) => {
                        const updatedRows = [...section.rows];
                        updatedRows[rIndex] = { ...updatedRows[rIndex], [col]: e.target.value };
                        setSections( sections.map((sec) => (sec.name === section.name ? { ...sec, rows: updatedRows } : sec)));}} />
                    </td>
                  ))}

                  <td><button onClick={() => removeRow(section.name, rIndex)} className="remove">Remove</button></td>
                </tr>
              ))}

            </tbody>
          </table>


          <button onClick={() => addRow(section.name)} className="Addrow">Add Row</button>
        </div>
      ))}

            <div>
              <button onClick={exportJSON} className="ExpoButton" >Export JSON</button>
              <button onClick={exportExcel} className="ExpoButton">Export Excel</button>
            </div>
    </div>
  );
}
export default Project;