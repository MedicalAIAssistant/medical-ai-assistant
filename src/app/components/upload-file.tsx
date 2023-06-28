const UploadFile = ({ onUpload }: any) => {
  const onChange = (e: any) => {
    const file = e.target.files[0];
    onUpload(file);
  };
  return (
    <input onChange={onChange} id="fileSelect" type="file" multiple={false} disabled={true} />
  );
};

export default UploadFile;
