function createResizer(options) {
  let isResizing = false;
  let startX = 0;
  let startY = 0;
  let initialData = null;

  function handleMouseMove(event) {
    if (!isResizing) return;

    const state = {
      isResizing,
      startX,
      startY,
      currentX: event.clientX,
      currentY: event.clientY,
      deltaX: event.clientX - startX,
      deltaY: event.clientY - startY,
      initialData
    };

    options.onMove?.(event, state);
  }

  function handleMouseUp() {
    if (!isResizing) return;

    isResizing = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';

    const state = {
      isResizing: false,
      startX,
      startY,
      initialData
    };

    options.onEnd?.(state);
  }

  function startResize(event, data = null) {
    isResizing = true;
    startX = event.clientX;
    startY = event.clientY;
    initialData = data;

    event.preventDefault();
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const state = {
      isResizing: true,
      startX,
      startY,
      initialData
    };

    options.onStart?.(event, state);
  }

  return {
    startResize,
    isResizing: () => isResizing,
    cleanup: handleMouseUp
  };
}

export function createPanelResizer(options) {
  const { onResize, minPercent = 20, maxPercent = 80 } = options;

  return createResizer({
    onMove: (event) => {
      const containerWidth = window.innerWidth;
      const mouseX = event.clientX;
      const newWidth = Math.min(
        Math.max((mouseX / containerWidth) * 100, minPercent),
        maxPercent
      );
      onResize(newWidth);
    }
  });
}

export function createColumnResizer(options) {
  const { columns, columnWidths, onResize, containerSelector = 'table' } = options;
  let resizingColumn = null;
  let startWidth = 0;

  return createResizer({
    onStart: (_, state) => {
      resizingColumn = state.initialData;
      startWidth = columnWidths[resizingColumn];
    },

    onMove: (event, state) => {
      if (!resizingColumn) return;

      const container = event.target.closest(containerSelector);
      const containerWidth = container?.offsetWidth || 800;
      const deltaPercent = (state.deltaX / containerWidth) * 100;
      const newWidth = Math.max(5, Math.min(50, startWidth + deltaPercent));

      // Find next column to adjust
      const columnIndex = columns.indexOf(resizingColumn);
      const nextColumn = columns[columnIndex + 1];

      if (nextColumn) {
        const difference = newWidth - columnWidths[resizingColumn];
        const nextNewWidth = Math.max(
          5,
          columnWidths[nextColumn] - difference
        );

        const updatedWidths = {
          ...columnWidths,
          [resizingColumn]: newWidth,
          [nextColumn]: nextNewWidth
        };

        onResize(updatedWidths);
      }
    },

    onEnd: () => {
      resizingColumn = null;
      startWidth = 0;
    }
  });
}
