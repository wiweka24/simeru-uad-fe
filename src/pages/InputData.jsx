import InputData from "../components/InputData/InputDataTemplate";

export function Subclass() {
  const defaultInput = {
    name: "",
    quota: 32,
    credit: 3,
    semester: 1,
  };

  const inputField = [
    {
      id: 1,
      name: "Nama Matkul",
      placeholder: "Masukkan nama matkul",
      valuefor: "name",
      type: "text",
      width: "col-span-3",
    },
    {
      id: 2,
      name: "Kuota",
      placeholder: "32",
      valuefor: "quota",
      type: "number",
      width: "col-span-1",
    },
    {
      id: 3,
      name: "SKS",
      placeholder: "3",
      valuefor: "credit",
      type: "number",
      width: "col-span-1",
    },
    {
      id: 4,
      name: "Semester",
      placeholder: "1",
      valuefor: "semester",
      type: "number",
      width: "col-span-1",
    },
  ];

  return (
    <InputData
      defaultInput={defaultInput}
      inputField={inputField}
      path="subclass"
      attribute="sub_class_id"
      title="Mata Kuliah"
    />
  );
}

export function Lecturer() {
  const defaultInput = {
    name: "",
    email: "",
    phone_number: "",
  };

  const inputField = [
    {
      id: 1,
      name: "Nama Dosen",
      placeholder: "Masukkan nama dosen",
      valuefor: "name",
      type: "text",
      width: "col-span-2",
    },
    {
      id: 2,
      name: "Email",
      placeholder: "***@mail.com",
      valuefor: "email",
      type: "email",
      width: "col-span-2",
    },
    {
      id: 3,
      name: "Nomor Telepon",
      placeholder: "(+62) xxxx xxxx",
      valuefor: "phone_number",
      type: "text",
      width: "col-span-2",
    },
  ];

  return (
    <InputData
      defaultInput={defaultInput}
      inputField={inputField}
      path="lecturer"
      attribute="lecturer_id"
      title="Dosen"
    />
  );
}

export function Room() {
  const defaultInput = {
    name: "",
    quota: 75,
  };

  const inputField = [
    {
      id: 1,
      name: "Nama Ruang",
      placeholder: "Masukkan nama ruangan",
      valuefor: "name",
      type: "text",
      width: "col-span-4",
    },
    {
      id: 2,
      name: "Kuota",
      placeholder: "75",
      valuefor: "quota",
      type: "number",
      width: "col-span-2",
    },
  ];

  return (
    <InputData
      defaultInput={defaultInput}
      inputField={inputField}
      path="room"
      attribute="room_id"
      title="Ruang Kelas"
    />
  );
}
