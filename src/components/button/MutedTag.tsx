const MutedTag = ({ tag, color }: { tag: string; color: string }) => {
  return (
    <div
      className={`px-4 py-2 rounded-2xl cursor-default bg-[#f0f0f0] shadow-[inset_0_4px_4px_rgba(0,0,0,0.2)] shadow-black/6 ${color} overflow-hidden`}
    >
      <p className="text-xs font-semibold truncate whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
        {tag}
      </p>
    </div>
  );
};

export default MutedTag;
